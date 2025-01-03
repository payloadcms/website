import { toHTML } from 'discord-markdown'
import sanitizeSlug from '../utilities/sanitizeSlug'
import cliProgress from 'cli-progress'
import { Payload } from 'payload'

const { DISCORD_SCRAPE_CHANNEL_ID, DISCORD_TOKEN, DISCORD_GUILD_ID, NEXT_PUBLIC_CMS_URL } =
  process.env
const DISCORD_API_BASE = 'https://discord.com/api/v10'
const answeredTag = '1034538089546264577'
const headers = {
  Authorization: `Bot ${DISCORD_TOKEN}`,
}

type Thread = {
  id: string
  guild_id: string
  name: string
  applied_tags: string[]
  message_count: number
  thread_metadata: {
    archived: boolean
    archive_timestamp: string
  }
}

type Message = {
  author: {
    id: string
    bot: boolean
    avatar: string
    username: string
  }
  content: string
  attachments: any[]
  timestamp: string
  position: number
  bot: boolean
}

async function fetchFromDiscord(
  endpoint: string,
  fetchType: 'threads' | 'messages',
): Promise<any[]> {
  const baseURL = `${DISCORD_API_BASE}${endpoint}`
  let allResults: any[] = []
  let hasMore = true
  let before: string | undefined
  let params: Record<string, string> = fetchType === 'messages' ? { limit: '100' } : {}

  while (hasMore) {
    const url = new URL(baseURL)
    if (before) params.before = before
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (fetchType === 'threads') {
      allResults = [...allResults, ...(data.threads || [])]
      hasMore = data.has_more || false
      before =
        hasMore && data.threads?.length
          ? data.threads[data.threads.length - 1].thread_metadata?.archive_timestamp
          : undefined
      console.log(before ? `Fetching ${fetchType} before ${before}` : `Fetching ${fetchType}`)
    } else if (fetchType === 'messages') {
      allResults = [...allResults, ...data]
      hasMore = data.length === 100
      before = hasMore && data.length >= 100 ? data[data.length - 1]?.id : undefined
    }

    if (!hasMore || !before) {
      console.log(` ${fetchType} fetched:`, allResults.length)
      break
    }
  }

  return allResults
}

function processMessages(messages: Message[]) {
  return messages
    .filter(
      (message) =>
        !message.author.bot || (message.author.bot && message.content && message.position === 0),
    )
    .reverse()
    .reduce((acc: Message[], message: Message) => {
      const prevMessage = acc[acc?.length - 1]
      if (prevMessage && prevMessage.author.id === message.author.id) {
        prevMessage.content += `\n \n ${message.content}`
        prevMessage.attachments = prevMessage.attachments.concat(message.attachments)
      } else {
        acc.push(message)
      }
      return acc
    }, [])
}

function createSanitizedThread(thread: Thread, messages: Message[]) {
  const [intro, ...combinedResponses] = processMessages(messages)

  return {
    slug: sanitizeSlug(thread.name),
    info: {
      id: thread.id,
      guildId: thread.guild_id,
      name: thread.name,
      archived: thread.thread_metadata.archived,
      createdAt: thread.thread_metadata.archive_timestamp,
    },
    intro: intro
      ? {
          authorAvatar: intro.author.avatar,
          authorID: intro.author.id,
          authorName: intro.author.username,
          content: toHTML(intro.content),
        }
      : {},
    messageCount: combinedResponses.length,
    ogMessageCount: thread.message_count,
    messages: combinedResponses.map(({ author, content, attachments, timestamp }) => ({
      authorAvatar: author.avatar,
      authorID: author.id,
      authorName: author.username,
      content: toHTML(content),
      createdAt: new Date(timestamp),
      fileAttachments: attachments,
    })),
  }
}

async function fetchDiscord(payload: Payload) {
  if (!DISCORD_TOKEN || !DISCORD_GUILD_ID || !DISCORD_SCRAPE_CHANNEL_ID) {
    const missingEnvVars = ['DISCORD_TOKEN', 'DISCORD_GUILD_ID', 'DISCORD_SCRAPE_CHANNEL_ID']
      .filter((envVar) => !process.env[envVar])
      .join(', ')
    throw new Error(`Missing required Discord variables: ${missingEnvVars}.`)
  }

  const bar = new cliProgress.SingleBar(
    {
      format: 'Populating Threads | {bar} | {percentage}% | {value}/{total}',
      barCompleteChar: '=',
      barIncompleteChar: '-',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  )

  console.time('Populating Discord')

  const activeThreadsData = await fetchFromDiscord(
    `/guilds/${DISCORD_GUILD_ID}/threads/active`,
    'threads',
  )
  const archivedThreadsData = await fetchFromDiscord(
    `/channels/${DISCORD_SCRAPE_CHANNEL_ID}/threads/archived/public`,
    'threads',
  )

  const allThreads = [...activeThreadsData, ...archivedThreadsData] as Thread[]

  const existingThreadIDs = await fetch(
    `${NEXT_PUBLIC_CMS_URL}/api/community-help?depth=0&where[communityHelpType][equals]=discord&limit=10000`,
  )
    .then((res) => res.json())
    .then((data) =>
      data.docs.map((thread) => {
        return {
          id: thread.discordID,
          messageCount: thread.ogMessageCount ? thread.ogMessageCount : 0,
        }
      }),
    )

  const filteredThreads = allThreads.filter((thread) => {
    const isValid = thread.applied_tags?.includes(answeredTag) && thread.message_count > 1
    const existingThread = existingThreadIDs.find(
      (existingThread) => existingThread.id === thread.id,
    )
    if (!isValid || (existingThread && existingThread.messageCount === thread.message_count))
      return false
    return true
  })

  bar.start(filteredThreads.length, 0)

  const populatedThreads = [] as any[]
  for (let i = 0; i < filteredThreads.length; i++) {
    const thread = filteredThreads[i]
    const messages = await fetchFromDiscord(`/channels/${thread.id}/messages`, 'messages')
    const sanitizedThread = createSanitizedThread(thread, messages)
    populatedThreads.push(sanitizedThread)

    bar.update(i + 1)
  }
  bar.stop()

  for (const thread of populatedThreads) {
    try {
      const threadExists = existingThreadIDs.some((existing) => existing.id === thread.info.id)
      if (threadExists) {
        await payload.update({
          collection: 'community-help',
          data: {
            slug: thread?.slug,
            communityHelpJSON: thread,
            title: thread?.info?.name,
          },
          where: { discordID: { equals: thread.info.id } },
          depth: 0,
        })
      } else {
        await payload.create({
          collection: 'community-help',
          data: {
            slug: thread?.slug,
            communityHelpJSON: thread,
            communityHelpType: 'discord',
            discordID: thread.info.id,
            title: thread.info.name,
          },
        })
      }
    } catch (error) {
      console.error(`Error processing thread ${thread.info.id}:`, error)
    }
  }

  console.timeEnd('Populating Discord')
}
export default fetchDiscord
