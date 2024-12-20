import config from '@payload-config'
import { getPayload } from 'payload'

import type { Post } from './payload-types'

const migratePostsToLexical = async () => {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 3,
  })

  const formatBlocks: (content: Post['content']) => Post['lexicalContent'] = content => {
    const newData: any[] = []
    for (const [index, block] of content.entries()) {
      if (block.blockType === 'blogContent') {
        newData.push(...block.blogContentFields.richText.root.children)
      } else {
        newData.push({
          type: 'block',
          fields: {
            blockName: '',
            ...block,
          },
          format: '',
          version: 2,
        })
      }
    }
    return {
      root: {
        type: 'root',
        children: newData,
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  for (const [index, post] of posts.docs.entries()) {
    console.log(`${index + 1} / ${posts.totalDocs} - Migrating "${post.title}"`)

    try {
      await payload.update({
        id: post.id,
        collection: 'posts',
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
