import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'
import discussions from '../discussions.json' assert { type: 'json' }
import threads from '../threads.json' assert { type: 'json' }

dotenv.config()

const appID = process.env.NEXT_PUBLIC_ALGOLIA_CH_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_CH_KEY
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_CH_INDEX_NAME

const client = algoliasearch(appID, apiKey)

const index = client.initIndex(indexName)

const discordRecords = threads.map(thread => {
  const { info, slug } = thread

  const messages = thread.messages.map(message => {
    return {
      author: message.authorName,
      content: message.content,
    }
  })

  return {
    objectID: info.id,
    platform: 'Discord',
    name: info.name,
    createdAt: info.createdAt,
    author: thread.messages[0].authorName,
    messages,
    messageCount: thread.messageCount,
    slug,
  }
})

const gitDiscussions = discussions.map(discussion => {
  const { id, title, body, author, createdAt, commentTotal, upvotes, slug } = discussion

  const comments = discussion.comments?.map(comment => {
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
  })

  return {
    objectID: id,
    platform: 'Github',
    name: title,
    description: body,
    createdAt,
    messageCount: commentTotal,
    upvotes,
    author: author.name,
    comments: comments || [],
    slug,
  }
})

const records = [...discordRecords, ...gitDiscussions]

index.saveObjects(records).wait()
