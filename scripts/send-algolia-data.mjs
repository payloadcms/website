import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

const COMMUNITY_HELPS = `
  query CommunityHelps {
    CommunityHelps(limit: 0) {
      docs {
        id
        title
        createdAt
        discordID
        githubID
        communityHelpJSON
        slug
      }
    }
  }
`

const next = {
  revalidate: 600,
}

const fetchCommunityHelps = async () => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?communityHelps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    next,
    body: JSON.stringify({
      query: COMMUNITY_HELPS,
    }),
  }).then(res => res.json())

  return data?.CommunityHelps?.docs
}

dotenv.config()

const appID = process.env.NEXT_PUBLIC_ALGOLIA_CH_ID
const apiKey = process.env.NEXT_PRIVATE_ALGOLIA_API_KEY
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_CH_INDEX_NAME

const client = algoliasearch(appID, apiKey)

const index = client.initIndex(indexName)


const fetchedCommunityHelps = await fetchCommunityHelps()

const discordObjects = fetchedCommunityHelps.filter(obj => obj.discordID !== null && obj.githubID === null);
const githubObjects = fetchedCommunityHelps.filter(obj => obj.githubID !== null && obj.discordID === null);

const threads = discordObjects.map(obj => obj.communityHelpJSON);
const discussions = githubObjects.map(obj => obj.communityHelpJSON);

const discordRecords = threads.map(thread => {
  const { info, intro, slug } = thread

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
    author: intro.authorName,
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
