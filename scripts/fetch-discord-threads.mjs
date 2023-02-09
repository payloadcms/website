// @ts-check
/* eslint-disable @typescript-eslint/no-unused-vars, no-console, no-underscore-dangle, no-use-before-define */
import path from 'path'
import { Client, Events, GatewayIntentBits, ChannelType } from 'discord.js'
import fs from 'fs'
import dotenv from 'dotenv'
import { Bar } from 'cli-progress'

import { fileURLToPath } from 'url'

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
  console.log(threads)
  const allThreads = threads.map(async info => {
    return info
  })

  const progress = new Bar({
    format: 'Fetching messages [{bar}] {percentage}% | {value}/{total}',
  })

  progress.start(allThreads.length, 0)

  const formattedThreads = await mapAsync(allThreads, async t => {
    const info = await t
    const messages = await info.messages.fetch()
    progress.increment()

    return {
      info: {
        name: info.name,
        id: info.id,
        createdAt: info.createdTimestamp,
      },
      messages: messages.reverse().map(m => {
        const { cleanContent, author } = m
        return { content: cleanContent, author: author.username }
      }),
    }
  })
  console.log('\n\n')

  fs.writeFileSync(
    './src/app/community-help/discord/threads.json',
    JSON.stringify(formattedThreads, null, 2),
  )
  console.log(`threads.json written`)
  process.exit(0)
})

client.login(process.env.DISCORD_TOKEN)

async function mapAsync(arr, callbackfn) {
  return Promise.all(arr.map(callbackfn))
}
