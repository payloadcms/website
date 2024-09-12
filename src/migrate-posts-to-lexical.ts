import { getPayload } from 'payload'
import config from '@payload-config'
import { Post } from './payload-types'

const migratePostsToLexical = async () => {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    limit: 3,
    depth: 1,
  })

  const formatBlocks: (content: Post['content']) => Post['lexicalContent'] = content => {
    let newData: any[] = []
    for (const [index, block] of content.entries()) {
      if (block.blockType === 'blogContent') {
        newData.push(...block.blogContentFields.richText.root.children)
      } else {
        newData.push({
          format: '',
          type: 'block',
          version: 2,
          fields: {
            blockName: '',
            ...block,
          },
        })
      }
    }
    return {
      root: {
        children: newData,
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }
  }

  for (const [index, post] of posts.docs.entries()) {
    console.log(`${index + 1} / ${posts.totalDocs} - Migrating "${post.title}"`)

    try {
      await payload.update({
        collection: 'posts',
        id: post.id,
        data: {
          lexicalContent: formatBlocks(post.content) as any,
        },
      })
    } catch (error) {
      console.error(`ERROR: Error migrating "${post.title}"`, error)
      return
    }

    console.log(`Migrated "${post.title}"`)
  }

  process.exit(0)
}

migratePostsToLexical()
