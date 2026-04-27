import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { BasePayload } from 'payload'

import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

type BuildReleasePostDataArgs = {
  body: string
  payload: BasePayload
  version: string
}

export const buildReleasePostData = async ({
  body,
  payload,
  version,
}: BuildReleasePostDataArgs): Promise<Record<string, unknown>> => {
  const categoryResult = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { slug: { equals: 'releases' } },
  })
  if (categoryResult.docs.length === 0) {
    throw new Error('Releases category not found')
  }
  const category = categoryResult.docs[0]

  const userResult = await payload.find({
    collection: 'users',
    limit: 1,
    where: { email: { equals: 'dev@payloadcms.com' } },
  })
  if (userResult.docs.length === 0) {
    throw new Error('Author dev@payloadcms.com not found')
  }
  const author = userResult.docs[0]

  const mediaResult = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: 'og-image.jpg' } },
  })
  const ogImage = mediaResult.docs.length > 0 ? mediaResult.docs[0] : null

  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const richText = convertMarkdownToLexical({ editorConfig, markdown: body })

  const excerptContent = {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Fill this in with details about the release',
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }

  const publishedOn = new Date(Date.now() + ONE_WEEK_MS).toISOString()

  return {
    authors: [author.id],
    authorType: 'team',
    category: category.id,
    content: [
      {
        blockType: 'blogContent',
        blogContentFields: { richText },
      },
    ],
    excerpt: excerptContent as SerializedEditorState,
    featuredMedia: 'upload',
    ...(ogImage ? { image: ogImage.id } : {}),
    publishedOn,
    title: `New in Payload: Release ${version}`,
  }
}
