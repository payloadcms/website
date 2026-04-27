import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { BasePayload } from 'payload'

import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { Media } from '@root/payload-types'

import { generateReleaseOgImage } from './generateReleaseOgImage'

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

  const postTitle = `New in Payload: Release ${version}`
  let uploadedOgImage: Media | null = null
  try {
    payload.logger.info({ msg: '[OG] Generating image buffer...' })
    const imageBuffer = await generateReleaseOgImage(version)
    payload.logger.info({ msg: `[OG] Buffer size: ${imageBuffer.length}` })
    uploadedOgImage = await payload.create({
      collection: 'media',
      data: { alt: postTitle },
      file: {
        data: imageBuffer,
        mimetype: 'image/png',
        name: `release-og-${version}.png`,
        size: imageBuffer.length,
      },
    })
    payload.logger.info({ id: uploadedOgImage?.id, msg: '[OG] Media created' })
  } catch (err) {
    payload.logger.error({ err, msg: `OG image generation failed for ${postTitle}` })
  }
  payload.logger.info({ id: uploadedOgImage?.id, msg: '[OG] uploadedOgImage after try/catch' })

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
    ...(uploadedOgImage ? { image: uploadedOgImage.id } : {}),
    meta: {
      ...(uploadedOgImage ? { image: uploadedOgImage.id } : {}),
      title: postTitle,
    },
    publishedOn,
    title: postTitle,
  }
}
