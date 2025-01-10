import algoliasearch from 'algoliasearch'
import payload from 'payload'

const appID = process.env.NEXT_PUBLIC_ALGOLIA_CH_ID || ''
const apiKey = process.env.NEXT_PRIVATE_ALGOLIA_API_KEY || ''
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_CH_INDEX_NAME || ''

const client = algoliasearch(appID, apiKey)

const index = client.initIndex(indexName)

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
  if (!appID || !apiKey || !indexName) {
    throw new Error('Algolia environment variables are not set')
  }

  const { docs } = await payload.find({
    collection: 'community-help',
    limit: 30000,
  })

  const discordDocs: DiscordDoc[] = []
  const githubDocs: GithubDoc[] = []

  docs.forEach((doc) => {
    const { communityHelpJSON, discordID, githubID, helpful } = doc as any

    if (discordID) {
      const { slug, info, intro, messageCount, messages } = communityHelpJSON
      discordDocs.push({
        name: info.name,
        slug,
        author: intro.authorName,
        createdAt: info.createdAt,
        helpful: helpful ?? false,
        messageCount,
        messages: messages.map((message) => {
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
      const { id, slug, author, body, comments, commentTotal, createdAt, title, upvotes } =
        communityHelpJSON

      githubDocs.push({
        name: title,
        slug,
        author: author.name,
        comments: (comments || []).map((comment) => {
          const replies = comment.replies?.map((reply) => {
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

export default syncToAlgolia
