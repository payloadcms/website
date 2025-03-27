import type { Metadata } from 'next'

import { Banner } from '@components/Banner'
import { RenderDocs } from '@components/RenderDocs'
import config from '@payload-config'
import { sanitizeServerEditorConfig } from '@payloadcms/richtext-lexical'
import { contentLexicalEditorFeatures } from '@root/collections/Docs'
import { mdxToLexical } from '@root/collections/Docs/mdxToLexical'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import React from 'react'

import { fetchLocalDocs } from './api'

export type TopicsOrder = { topics: string[] }[]

type Params = { doc: string; topic: string }

export default async function DocsPage(args: {
  params: Promise<Params>
  searchParams: Promise<{
    branch: string
  }>
}) {
  await headers()
  const { params } = args
  const { doc: docSlug, topic: topicSlug } = await params
  const payload = await getPayload({ config })

  const topics = fetchLocalDocs()

  const groupIndex = topics.findIndex(({ topics: tGroup }) =>
    tGroup.some((topic) => topic?.slug?.toLowerCase() === topicSlug),
  )

  const indexInGroup = topics[groupIndex]?.topics?.findIndex(
    (topic) => topic?.slug?.toLowerCase() === topicSlug,
  )

  const topicGroup = topics?.[groupIndex]

  const topic = topicGroup?.topics?.[indexInGroup]

  const docIndex = topic?.docs.findIndex((doc) => doc.slug.replace('.mdx', '') === docSlug)

  const curParsedDoc = topic?.docs?.[docIndex]

  if (!curParsedDoc) {
    notFound()
  }

  const mdx = curParsedDoc.content

  const editorConfig = await sanitizeServerEditorConfig(
    {
      features: contentLexicalEditorFeatures,
    },
    payload.config,
  )

  const { editorState } = mdxToLexical({
    editorConfig,
    mdx,
  })

  const curDoc: RequiredDataFromCollectionSlug<'docs'> = {
    slug: curParsedDoc.slug,
    content: editorState as any,
    description: curParsedDoc.desc,
    headings: curParsedDoc.headings,
    keywords: curParsedDoc.keywords,
    label: curParsedDoc.label,
    order: curParsedDoc.order,
    path: `${topic.slug}/${curParsedDoc.slug}`,
    title: curParsedDoc.title,
    topic: topic.slug,
    topicGroup: topicGroup.groupLabel,
    version: 'local',
  }

  if (!curDoc) {
    notFound()
  }

  return (
    <>
      <RenderDocs
        currentDoc={curDoc as any}
        docSlug={docSlug}
        // @ts-expect-error // TODO: fix this type
        topicGroups={topics}
        topicSlug={topicSlug}
        version="local"
      >
        <Banner type="warning">
          You are currently viewing documentation from your local repository.
        </Banner>
      </RenderDocs>
    </>
  )
}

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}
