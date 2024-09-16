import algoliasearch from 'algoliasearch'
import cron from 'node-cron'
import payload from 'payload'

import { fetchDiscordThreads } from '../../scripts/fetch-discord'
import { fetchGithubDiscussions } from '../../scripts/fetch-github'

const appID = process.env.ALGOLIA_CH_ID || ''
const apiKey = process.env.ALGOLIA_API_KEY || ''
const indexName = process.env.ALGOLIA_CH_INDEX_NAME || ''

const client = algoliasearch(appID, apiKey)

const index = client.initIndex(indexName)

const cronOptions: cron.ScheduleOptions = {
  scheduled: false,
  timezone: 'America/Detroit',
}

interface DiscordDoc {
  author: string
  createdAt: string
  helpful: boolean
  messageCount: number
  messages: unknown[]
  name: string
  objectID: string
  platform: 'Discord' | 'Github'
  slug: string
}

interface GithubDoc {
  author: string
  comments: unknown[]
  createdAt: string
  description: string
  helpful: boolean
  messageCount: number
  name: string
  objectID: string
  platform: 'Discord' | 'Github'
  slug: string
  upvotes: number
}
export const syncToAlgolia = async (): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log('RUNNING')
  await fetchDiscordThreads(payload)
  await fetchGithubDiscussions(payload)

  const { docs } = await payload.find({
    collection: 'community-help',
    limit: 3000,
  })

  const discordDocs: DiscordDoc[] = []
  const githubDocs: GithubDoc[] = []

  docs.forEach(doc => {
    const { communityHelpJSON, discordID, githubID, helpful } = doc

    if (discordID) {
      const { slug, info, intro, messageCount, messages } = communityHelpJSON as any
      discordDocs.push({
        name: info.name,
        slug,
        author: intro.authorName,
        createdAt: info.createdAt,
        helpful: helpful ?? false,
        messageCount,
        messages: messages.map(message => {
          return {
            author: message.authorName,
            content: message.content,
          }
        }),
        objectID: info.id,
        platform: 'Discord',
      })
    }

    if (githubID) {
      const { id, slug, author, body, commentTotal, comments, createdAt, title, upvotes } =
        communityHelpJSON as any

      githubDocs.push({
        name: title,
        slug,
        author: author.name,
        comments: (comments || []).map(comment => {
          const replies = comment.replies?.map(reply => {
            return {
              author: reply.author.name,
              content: reply.body,
            }
          })

          return {
            author: comment.author.name,
            content: comment.body,
            replies: replies || [],
          }
        }),
        createdAt,
        description: body,
        helpful: helpful ?? false,
        messageCount: commentTotal,
        objectID: id,
        platform: 'Github',
        upvotes,
      })
    }
  })

  const records = [...discordDocs, ...githubDocs]

  await index.saveObjects(records).wait()
}

const schedule = '0 1 * * *' // 1am
export const syncToAlgoliaCron = cron.schedule(schedule, syncToAlgolia, cronOptions)
