// @ts-check
/* eslint-disable @typescript-eslint/no-unused-vars, no-console, no-underscore-dangle, no-use-before-define */
import path from 'path'
import { Client, Events, GatewayIntentBits, ChannelType } from 'discord.js'
import fs from 'fs'
import dotenv from 'dotenv'
import { Bar } from 'cli-progress'
import DiscordMarkdown from 'discord-markdown'

import { fileURLToPath } from 'url'

const { toHTML } = DiscordMarkdown

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

const { DISCORD_TOKEN, DISCORD_SCRAPE_CHANNEL_ID } = process.env
if (!DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN is required')
}
if (!DISCORD_SCRAPE_CHANNEL_ID) {
  throw new Error('DISCORD_SCRAPE_CHANNEL_ID is required')
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] })

const tagMap = {
  answered: '1034538089546264577',
  unanswered: '1043188477002526750',
  stale: '1052600637898096710',
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

  const fetchedThreads = await communityHelpChannel.threads.fetchActive()
  const { threads } = fetchedThreads

  const allThreads = threads.map(async info => {
    return info
  })

  const progress = new Bar({
    format: 'Fetching messages [{bar}] {percentage}% | {value}/{total}',
  })

  progress.start(allThreads.length, 0)

  const formattedThreads = await mapAsync(allThreads, async t => {
    const info = await t

    progress.increment()

    // Filter out all threads that are not marked as unanswered
    if (info.appliedTags.includes(tagMap.unanswered)) return null

    const messages = await info.messages.fetch()

    return {
      info: {
        name: info.name,
        id: info.id,
        guildId: info.guildId,
        createdAt: info.createdTimestamp,
      },
      messages: messages.reverse().map(m => {
        const { createdTimestamp, cleanContent, author, attachments } = m
        return {
          content: toHTML(cleanContent),
          fileAttachments: attachments,
          authorID: author.id,
          authorName: author.username,
          authorAvatar: author.avatar,
          createdAtDate: createdTimestamp,
        }
      }),
      messageCount: info.messageCount,
      slug: info.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
    }
  })
  console.log('\n\n')

  fs.writeFileSync('threads.json', JSON.stringify(formattedThreads.filter(Boolean), null, 2))
  console.log(`threads.json written`)
  process.exit(0)
})

client.login(process.env.DISCORD_TOKEN)

async function mapAsync(arr, callbackfn) {
  return Promise.all(arr.map(callbackfn))
}
