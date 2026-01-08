// @ts-ignore
import * as discordMDX from 'discord-markdown'
const { toHTML } = discordMDX
import cliProgress from 'cli-progress'
import { cookies } from 'next/headers'

import sanitizeSlug from '../utilities/sanitizeSlug'

const { DISCORD_GUILD_ID, DISCORD_SCRAPE_CHANNEL_ID, DISCORD_TOKEN, NEXT_PUBLIC_CMS_URL } =
  process.env
const DISCORD_API_BASE = 'https://discord.com/api/v10'
const answeredTag = '1034538089546264577'
const headers = {
  Authorization: `Bot ${DISCORD_TOKEN}`,
}

type Thread = {
  applied_tags: string[]
  guild_id: string
  id: string
  message_count: number
  name: string
  thread_metadata: {
    archived: boolean
    create_timestamp: string
  }
}

type Message = {
  attachments: any[]
  author: {
    avatar: string
    bot: boolean
    id: string
    username: string
  }
  bot: boolean
  content: string
  position: number
  timestamp: string
}

type ExistingThread = {
  discordID: string
  docId: string
  messageCount: number
}

function segmentArray(array, segmentSize) {
  const result: Array<(typeof array)[0]> = []
  for (let i = 0; i < array.length; i += segmentSize) {
    result.push(array.slice(i, i + segmentSize))
  }
  return result
}

async function fetchFromDiscord(
  endpoint: string,
  fetchType: 'messages' | 'threads',
  retries = 3,
): Promise<any[]> {
  const baseURL = `${DISCORD_API_BASE}${endpoint}`
  const allResults: Message[] | Thread[] = []
  const params: Record<string, string> = fetchType === 'messages' ? { limit: '100' } : {}

  while (true) {
    const url = new URL(baseURL)
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))

    let response
    let lastError

    // Retry logic for transient failures
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        response = await fetch(url, { headers })

        if (response.ok) {
          break // Success, exit retry loop
        }

        // If it's a 503 Service Unavailable or 429 Rate Limit, retry
        if (response.status === 503 || response.status === 429) {
          const waitTime = response.status === 429 ? 5000 : 2000 // Wait longer for rate limits
          console.warn(
            `[fetchDiscord] ${response.status} ${response.statusText} for ${endpoint}, retrying in ${waitTime}ms (attempt ${attempt + 1}/${retries + 1})`,
          )
          await new Promise((resolve) => setTimeout(resolve, waitTime))
          continue
        }

        // For other errors, throw immediately
        throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`)
      } catch (error) {
        lastError = error
        if (attempt < retries) {
          console.warn(`[fetchDiscord] Error fetching ${endpoint}, retrying (attempt ${attempt + 1}/${retries + 1}):`, error)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }
    }

    if (!response || !response.ok) {
      console.error(`[fetchDiscord] Failed to fetch ${endpoint} after ${retries + 1} attempts, skipping...`)
      throw lastError || new Error(`Failed to fetch ${endpoint}`)
    }

    const data = await response.json()
    if (fetchType === 'threads') {
      allResults.push(...(data.threads || []))
      if (!data.has_more) {
        break
      }
      params.before = data.threads[data.threads.length - 1]?.thread_metadata?.archive_timestamp
    } else {
      allResults.push(...data)
      if (data.length < 100) {
        break
      }
      params.before = data[data.length - 1]?.id
    }
  }

  return allResults.reverse()
}

function processMessages(messages: Message[]) {
  const mergedMessages: Message[] = []

  for (let i = 0; i < messages.length; i++) {
    const currentMessage = messages[i]

    if (!currentMessage.author || (!currentMessage.attachments && !currentMessage.content)) {
      // Skip messages without content or author
      continue
    }

    const isBot =
      currentMessage.author.bot ||
      currentMessage.author.username === 'Payload-Bot' ||
      currentMessage.author.username.includes('Bot')

    if (isBot) {
      continue
    }

    if (
      mergedMessages.length > 0 &&
      mergedMessages[mergedMessages.length - 1].author.id === currentMessage.author.id
    ) {
      const prevMessage = mergedMessages[mergedMessages.length - 1]
      prevMessage.content += `\n\n${currentMessage.content}`
      prevMessage.attachments = prevMessage.attachments.concat(currentMessage.attachments)
    } else {
      mergedMessages.push({ ...currentMessage })
    }
  }

  return mergedMessages
}

function createSanitizedThread(thread: Thread, messages: Message[]) {
  const [intro, ...combinedResponses] = processMessages(messages)
  const createdAtDate = intro
    ? new Date(intro.timestamp).toISOString()
    : new Date(thread.thread_metadata.create_timestamp).toISOString()

  return {
    slug: sanitizeSlug(thread.name),
    info: {
      id: thread.id,
      name: thread.name,
      archived: thread.thread_metadata.archived,
      createdAt: createdAtDate,
      guildId: thread.guild_id,
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
    messages: combinedResponses.map(({ attachments, author, content, timestamp }) => ({
      authorAvatar: author.avatar,
      authorID: author.id,
      authorName: author.username,
      content: toHTML(content),
      createdAt: new Date(timestamp),
      fileAttachments: attachments,
    })),
    ogMessageCount: thread.message_count,
  }
}

async function fetchDiscord() {
  if (!DISCORD_TOKEN || !DISCORD_GUILD_ID || !DISCORD_SCRAPE_CHANNEL_ID) {
    const missingEnvVars = ['DISCORD_TOKEN', 'DISCORD_GUILD_ID', 'DISCORD_SCRAPE_CHANNEL_ID']
      .filter((envVar) => !process.env[envVar])
      .join(', ')
    throw new Error(`Missing required Discord variables: ${missingEnvVars}.`)
  }

  const bar = new cliProgress.SingleBar(
    {
      barCompleteChar: '=',
      barIncompleteChar: '-',
      format: 'Populating Threads | {bar} | {percentage}% | {value}/{total}',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  )

  console.time('[fetchDiscord] Total duration')
  console.log('[fetchDiscord] Starting Discord sync...')

  const activeThreadsData = await fetchFromDiscord(
    `/guilds/${DISCORD_GUILD_ID}/threads/active`,
    'threads',
  )
  console.log(`[fetchDiscord] Found ${activeThreadsData.length} active threads`)

  const archivedThreadsData = await fetchFromDiscord(
    `/channels/${DISCORD_SCRAPE_CHANNEL_ID}/threads/archived/public`,
    'threads',
  )
  console.log(`[fetchDiscord] Found ${archivedThreadsData.length} archived threads`)

  const allThreads = [...activeThreadsData, ...archivedThreadsData].filter(
    (thread) => thread.applied_tags?.includes(answeredTag) && thread.message_count > 1,
  ) as Thread[]
  console.log(
    `[fetchDiscord] ${allThreads.length} threads after filtering (answered + has messages)`,
  )

  const existingThreadIDs: ExistingThread[] = await fetch(
    `${NEXT_PUBLIC_CMS_URL}/api/community-help?depth=0&where[communityHelpType][equals]=discord&limit=0`,
  )
    .then((res) => res.json())
    .then((data) =>
      data.docs.map((thread) => ({
        discordID: thread.discordID,
        docId: thread.id,
        messageCount: thread.communityHelpJSON.messageCount || 0,
      })),
    )

  const filteredThreads = allThreads.filter((thread) => {
    const existingThread = existingThreadIDs.find((existing) => existing.discordID === thread.id)
    return (
      !existingThread || (existingThread && existingThread.messageCount !== thread.message_count)
    )
  })

  console.log(
    `[fetchDiscord] Found ${existingThreadIDs.length} existing threads in CMS, ${filteredThreads.length} need to be synced`,
  )

  if (filteredThreads.length === 0) {
    console.log('[fetchDiscord] No threads to sync. All up to date!')
    console.timeEnd('[fetchDiscord] Total duration')
    return
  }

  bar.start(filteredThreads.length, 0)

  const threadSegments = segmentArray(filteredThreads, 10)
  const populatedThreads: any[] = []

  for (const segment of threadSegments) {
    const threadPromises = segment.map(async (thread) => {
      try {
        const messages = await fetchFromDiscord(`/channels/${thread.id}/messages`, 'messages')
        return createSanitizedThread(thread, messages)
      } catch (error) {
        console.error(
          `[fetchDiscord] Failed to fetch messages for thread "${thread.name}" (${thread.id}), skipping:`,
          error.message,
        )
        return null // Return null for failed threads so we can filter them out
      }
    })

    const sanitizedThreads = await Promise.all(threadPromises)
    const successfulThreads = sanitizedThreads.filter((t) => t !== null)
    populatedThreads.push(...successfulThreads)
    bar.update(populatedThreads.length)
  }

  bar.stop()

  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  if (!token) {
    throw new Error('You are unauthorized, please log in.')
  }

  const populateAll = async () => {
    let stopProcessing = false

    for (const thread of populatedThreads) {
      if (stopProcessing) {
        break
      }

      const existingThread = existingThreadIDs.find(
        (existing) => existing.discordID === thread.info.id,
      )
      const body = JSON.stringify({
        slug: thread.slug,
        communityHelpJSON: thread,
        communityHelpType: 'discord',
        discordID: thread.info.id,
        threadCreatedAt: thread.info.createdAt,
        title: thread.info.name,
      })

      const endpoint = existingThread
        ? `${NEXT_PUBLIC_CMS_URL}/api/community-help/${existingThread.docId}`
        : `${NEXT_PUBLIC_CMS_URL}/api/community-help`

      const method = existingThread ? 'PATCH' : 'POST'

      const options = {
        body,
        headers: {
          Authorization: `JWT ${token.value}`,
          'Content-Type': 'application/json',
        },
        method,
      }

      try {
        const response = await fetch(endpoint, options)

        if (!response.ok) {
          const errorText = await response.text()
          if (response.status === 504) {
            console.error(
              `[fetchDiscord] 504 Gateway Timeout for thread "${thread.info.name}" (${thread.info.id}). Stopping process.`,
            )
            stopProcessing = true
            break
          } else {
            console.error(
              `[fetchDiscord] ${method} failed for thread "${thread.info.name}" (${thread.info.id}): ${response.status} ${response.statusText}`,
            )
            console.error(`[fetchDiscord] Response body: ${errorText}`)
          }
        } else {
          const action = method === 'POST' ? 'created' : 'updated'
          console.log(
            `[fetchDiscord] Successfully ${action} thread "${thread.info.name}" (${thread.info.id})`,
          )
        }
      } catch (error) {
        console.error(
          `[fetchDiscord] Exception processing thread "${thread.info.name}" (${thread.info.id}):`,
          error,
        )
        stopProcessing = true
        break
      }
    }
  }

  await populateAll()
  console.log('[fetchDiscord] Sync completed!')
  console.timeEnd('[fetchDiscord] Total duration')
}

export default fetchDiscord
