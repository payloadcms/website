// @ts-ignore
import * as discordMDX from 'discord-markdown'
const { toHTML } = discordMDX
import cliProgress from 'cli-progress'
import { getPayload } from 'payload'
import config from '@payload-config'

import sanitizeSlug from '../utilities/sanitizeSlug'

const { DISCORD_GUILD_ID, DISCORD_SCRAPE_CHANNEL_ID, DISCORD_TOKEN } = process.env
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

  // Only fetch archived threads if SYNC_ARCHIVED_THREADS is explicitly set to 'true'
  // This dramatically speeds up sync time by skipping 12,000+ archived threads that rarely change
  const shouldFetchArchived = process.env.SYNC_ARCHIVED_THREADS === 'true'
  let archivedThreadsData: Thread[] = []

  if (shouldFetchArchived) {
    archivedThreadsData = await fetchFromDiscord(
      `/channels/${DISCORD_SCRAPE_CHANNEL_ID}/threads/archived/public`,
      'threads',
    )
    console.log(`[fetchDiscord] Found ${archivedThreadsData.length} archived threads`)
  } else {
    console.log('[fetchDiscord] Skipping archived threads (set SYNC_ARCHIVED_THREADS=true to include them)')
  }

  const allThreads = [...activeThreadsData, ...archivedThreadsData].filter(
    (thread) => thread.applied_tags?.includes(answeredTag) && thread.message_count > 1,
  ) as Thread[]
  console.log(
    `[fetchDiscord] ${allThreads.length} threads after filtering (answered + has messages)`,
  )

  const payload = await getPayload({ config })
  const existingThreadsResult = await payload.find({
    collection: 'community-help',
    depth: 0,
    limit: 0,
    overrideAccess: true,
    where: {
      communityHelpType: {
        equals: 'discord',
      },
    },
  })

  const existingThreadIDs: ExistingThread[] = existingThreadsResult.docs.map((thread) => ({
    discordID: thread.discordID as string,
    docId: thread.id,
    messageCount: (thread.communityHelpJSON as any)?.messageCount || 0,
  }))

  const filteredThreads = allThreads.filter((thread) => {
    const existingThread = existingThreadIDs.find((existing) => existing.discordID === thread.id)
    return (
      !existingThread || (existingThread && existingThread.messageCount !== thread.message_count)
    )
  })

  // Apply batch limit if set
  const batchLimit = process.env.SYNC_BATCH_LIMIT
    ? parseInt(process.env.SYNC_BATCH_LIMIT, 10)
    : filteredThreads.length

  const threadsToSync = filteredThreads.slice(0, batchLimit)

  console.log(
    `[fetchDiscord] Found ${existingThreadIDs.length} existing threads in CMS, ${filteredThreads.length} need to be synced${
      batchLimit < filteredThreads.length
        ? ` (processing ${batchLimit} this run due to SYNC_BATCH_LIMIT)`
        : ''
    }`,
  )

  if (threadsToSync.length === 0) {
    console.log('[fetchDiscord] No threads to sync. All up to date!')
    console.timeEnd('[fetchDiscord] Total duration')
    return
  }

  bar.start(threadsToSync.length, 0)

  const threadSegments = segmentArray(threadsToSync, 10)
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

  const populateAll = async () => {
    for (const thread of populatedThreads) {
      const existingThread = existingThreadIDs.find(
        (existing) => existing.discordID === thread.info.id,
      )
      const data = {
        slug: thread.slug,
        communityHelpJSON: thread,
        communityHelpType: 'discord' as const,
        discordID: thread.info.id,
        threadCreatedAt: thread.info.createdAt,
        title: thread.info.name,
      }

      try {
        if (existingThread) {
          // Update existing thread
          await payload.update({
            id: existingThread.docId,
            collection: 'community-help',
            data,
            overrideAccess: true,
          })
          console.log(
            `[fetchDiscord] Successfully updated thread "${thread.info.name}" (${thread.info.id})`,
          )
        } else {
          // Create new thread
          await payload.create({
            collection: 'community-help',
            data,
            overrideAccess: true,
          })
          console.log(
            `[fetchDiscord] Successfully created thread "${thread.info.name}" (${thread.info.id})`,
          )
        }
      } catch (error) {
        console.error(
          `[fetchDiscord] Exception processing thread "${thread.info.name}" (${thread.info.id}):`,
          error,
        )
      }
    }
  }

  await populateAll()
  console.log('[fetchDiscord] Sync completed!')
  console.timeEnd('[fetchDiscord] Total duration')
}

export default fetchDiscord
