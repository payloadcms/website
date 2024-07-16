// @ts-check
/* eslint-disable @typescript-eslint/no-unused-vars, no-console, no-underscore-dangle, no-use-before-define */
import { Bar } from 'cli-progress'
import type { AnyThreadChannel, Message } from 'discord.js'
import { ChannelType, Client, Events, GatewayIntentBits } from 'discord.js'
import { toHTML } from 'discord-markdown'
import type { Payload } from 'payload'

import sanitizeSlug from '../utilities/sanitizeSlug'

// eslint-disable-next-line
require('dotenv').config()

const { DISCORD_TOKEN, DISCORD_SCRAPE_CHANNEL_ID, PAYLOAD_SECRET, MONGODB_URI } = process.env

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

  client.login(process.env.DISCORD_TOKEN)

  const tagMap = {
    answered: '1034538089546264577',
    unanswered: '1043188477002526750',
    stale: '1052600637898096710',
    payloadTeam: '1100551774043127851',
  }

  client.once(Events.ClientReady, async c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)

    // Get the community help channel
    const communityHelpChannel = client.channels.cache.get(DISCORD_SCRAPE_CHANNEL_ID)
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
      limit: 100,
      fetchAll: true,
    })

    const { threads: archiveThreads } = fetchedArchivedThreads

    const fetchedActiveThreads = await communityHelpChannel.threads.fetchActive()
    const { threads: activeThreads } = fetchedActiveThreads

    // Combines active threads with archived threads
    let threads = activeThreads.concat(archiveThreads)

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

        while (true) {
          const moreMessages = await info.messages.fetch({
            limit: 100,
            before: lastMessage,
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
        info: {
          name: info.name,
          id: info.id,
          guildId: info.guildId,
          createdAt: info.createdTimestamp,
          archived: info.archived,
        },
        intro: {
          content: toHTML(intro.cleanContent),
          fileAttachments: intro.attachments,
          authorID: intro.author.id,
          authorName: intro.author.username,
          authorAvatar: intro.author.avatar,
          createdAtDate: intro.createdTimestamp,
        },
        messages: combinedResponses.map(m => {
          const { createdTimestamp, cleanContent, author, attachments } = m
          return {
            content: toHTML(cleanContent),
            fileAttachments: JSON.parse(JSON.stringify(attachments, null)),
            authorID: author.id,
            authorName: author.username,
            authorAvatar: author.avatar,
            createdAtDate: createdTimestamp,
          }
        }),
        messageCount: combinedResponses ? combinedResponses?.length : info.messageCount,
        slug: sanitizeSlug(info.name),
      }
    })
    console.log('\n')
    await Promise.all(
      formattedThreads.map(async (thread, i) => {
        if (thread) {
          // Check if thread exists, if it does update existing thread else add thread to collection
          const existingThread = (await payload.find({
            collection: 'community-help',
            where: { discordID: { equals: thread.info.id } },
            limit: 1,
            depth: 0,
          })) as any

          const threadExists =
            existingThread.docs[0]?.communityHelpJSON?.info?.id === thread?.info?.id

          if (threadExists) {
            await payload.update({
              collection: 'community-help',
              id: existingThread.docs[0]?.id,
              data: {
                title: thread?.info?.name,
                communityHelpJSON: thread,
                slug: thread?.slug,
              },
              depth: 0,
            })
          } else {
            await payload.create({
              collection: 'community-help',
              data: {
                title: thread?.info?.name,
                communityHelpType: 'discord',
                discordID: thread?.info?.id,
                communityHelpJSON: thread,
                slug: thread?.slug,
              },
            })
          }
        }
      }),
    )
  })
}
