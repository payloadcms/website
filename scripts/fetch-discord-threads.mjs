// @ts-check
/* eslint-disable @typescript-eslint/no-unused-vars, no-console, no-underscore-dangle, no-use-before-define */
import path from 'path'
import { Client, Events, GatewayIntentBits, ChannelType } from 'discord.js'
import fs from 'fs'
import dotenv from 'dotenv'
import { Bar } from 'cli-progress'
import DiscordMarkdown from 'discord-markdown'
import { fileURLToPath } from 'url'

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

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

    const [intro, ...combinedResponses] = messages.reverse().reduce((acc, message) => {
      const prevMessage = acc[acc.length - 1]
      let newAuthor = true

      if (prevMessage) {
        // should combine with prev message - same author
        if (prevMessage.author.id === message.author.id) {
          prevMessage.content += `\n \n ${message.content}`
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
          fileAttachments: attachments,
          authorID: author.id,
          authorName: author.username,
          authorAvatar: author.avatar,
          createdAtDate: createdTimestamp,
        }
      }),
      messageCount: info.messageCount,
      slug: slugify(info.name),
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
