// @ts-check
import type { AnyThreadChannel, Message } from 'discord.js'
import type { Payload } from 'payload'

/* eslint-disable @typescript-eslint/no-unused-vars, no-console, no-underscore-dangle, no-use-before-define */
import { Bar } from 'cli-progress'
import { ChannelType, Client, Events, GatewayIntentBits } from 'discord.js'
import { toHTML } from 'discord-markdown'

import sanitizeSlug from '../utilities/sanitizeSlug'

// eslint-disable-next-line
require('dotenv').config()

const { DISCORD_SCRAPE_CHANNEL_ID, DISCORD_TOKEN, MONGODB_URI, PAYLOAD_SECRET } = process.env

if (!DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN is required')
}
if (!DISCORD_SCRAPE_CHANNEL_ID) {
  throw new Error('DISCORD_SCRAPE_CHANNEL_ID is required')
}

async function mapAsync(
  arr: any[],
  callbackfn: (value: any, index: number, array: any[]) => Promise<any>,
): Promise<any[]> {
  return Promise.all(arr.map(callbackfn))
}

export async function fetchDiscordThreads(payload: Payload): Promise<void> {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
  })

  await client.login(process.env.DISCORD_TOKEN)

  const tagMap = {
    answered: '1034538089546264577',
    payloadTeam: '1100551774043127851',
    stale: '1052600637898096710',
    unanswered: '1043188477002526750',
  }

  client.once(Events.ClientReady, async c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)

    // Get the community help channel
    const communityHelpChannel = client.channels.cache.get(DISCORD_SCRAPE_CHANNEL_ID || '')
    if (!communityHelpChannel) {
      console.log(`No channel found with id ${DISCORD_SCRAPE_CHANNEL_ID}`)
      return
    }

    if (communityHelpChannel.type !== ChannelType.GuildForum) {
      console.log('Not a GuildForum')
      return
    }

    // Fetches a max limit of 100 archived threads
    const fetchedArchivedThreads = await communityHelpChannel.threads.fetchArchived({
      fetchAll: true,
      limit: 100,
    })

    const { threads: archiveThreads } = fetchedArchivedThreads

    const fetchedActiveThreads = await communityHelpChannel.threads.fetchActive()
    const { threads: activeThreads } = fetchedActiveThreads

    // Combines active threads with archived threads
    const threads = activeThreads.concat(archiveThreads)

    const allThreads = threads.map(async info => {
      return info
    })

    const progress = new Bar({
      format: 'Fetching Discord threads [{bar}] {percentage}% | {value}/{total}',
    })

    progress.start(allThreads.length, 0)

    const formattedThreads = await mapAsync(allThreads, async t => {
      const info: AnyThreadChannel<boolean> = await t

      progress.increment()

      // Ensure that the thread belongs to the community-help channel
      if (info.parentId !== DISCORD_SCRAPE_CHANNEL_ID) {
        return null
      }

      // Filter out all threads that are not marked as answered
      if (!info.appliedTags.includes(tagMap.answered)) {
        return null
      }

      let messages = await info.messages.fetch({ limit: 100 })

      if (info.messageCount && info.messageCount > 100) {
        let lastMessage = messages.last()?.id

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const moreMessages = await info.messages.fetch({
            before: lastMessage,
            limit: 100,
          })

          if (!moreMessages.last()) break
          messages = messages.concat(moreMessages)
          lastMessage = moreMessages.last()?.id
        }
      }

      const [intro, ...combinedResponses] = messages
        .filter(
          message =>
            !message.author.bot ||
            (message.author.bot && message.content && message.position === 0),
        )
        .reverse()
        .reduce((acc: Message[], message) => {
          const prevMessage = acc[acc?.length - 1]
          let newAuthor = true

          if (prevMessage) {
            // should combine with prev message - same author
            if (prevMessage.author.id === message.author.id) {
              prevMessage.content += `\n \n ${message.content}`
              prevMessage.attachments = prevMessage.attachments.concat(message.attachments)
              newAuthor = false
            }
          }

          if (newAuthor) {
            acc.push(message)
          }
          return acc
        }, [])
      return {
        slug: sanitizeSlug(info.name),
        info: {
          id: info.id,
          name: info.name,
          archived: info.archived,
          createdAt: info.createdTimestamp,
          guildId: info.guildId,
        },
        intro: {
          authorAvatar: intro.author.avatar,
          authorID: intro.author.id,
          authorName: intro.author.username,
          content: toHTML(intro.cleanContent),
          createdAtDate: intro.createdTimestamp,
          fileAttachments: intro.attachments,
        },
        messageCount: combinedResponses ? combinedResponses?.length : info.messageCount,
        messages: combinedResponses.map(m => {
          const { attachments, author, cleanContent, createdTimestamp } = m
          return {
            authorAvatar: author.avatar,
            authorID: author.id,
            authorName: author.username,
            content: toHTML(cleanContent),
            createdAtDate: createdTimestamp,
            fileAttachments: JSON.parse(JSON.stringify(attachments, null)),
          }
        }),
      }
    })
    console.log('\n')
    await Promise.all(
      formattedThreads.map(async (thread, i) => {
        if (thread) {
          // Check if thread exists, if it does update existing thread else add thread to collection
          const existingThread = (await payload.find({
            collection: 'community-help',
            depth: 0,
            limit: 1,
            where: { discordID: { equals: thread.info.id } },
          })) as any

          const threadExists =
            existingThread.docs[0]?.communityHelpJSON?.info?.id === thread?.info?.id

          if (threadExists) {
            await payload.update({
              id: existingThread.docs[0]?.id,
              collection: 'community-help',
              data: {
                slug: thread?.slug,
                communityHelpJSON: thread,
                title: thread?.info?.name,
              },
              depth: 0,
            })
          } else {
            await payload.create({
              collection: 'community-help',
              data: {
                slug: thread?.slug,
                communityHelpJSON: thread,
                communityHelpType: 'discord',
                discordID: thread?.info?.id,
                title: thread?.info?.name,
              },
            })
          }
        }
      }),
    )
  })
}
