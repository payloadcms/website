import type { Topic } from '@root/collections/Docs/types'
import type { Metadata } from 'next'

import { Banner } from '@components/Banner'
import { RenderDocs } from '@components/RenderDocs'
import config from '@payload-config'
import { sanitizeServerEditorConfig } from '@payloadcms/richtext-lexical'
import { contentLexicalEditorFeatures } from '@root/collections/Docs'
import { mdxToLexical } from '@root/collections/Docs/mdxToLexical'
import { fetchDocs } from '@root/scripts/fetchDocs'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import React from 'react'

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

  const topicGroups = await fetchDocs({ ref: 'v3', source: 'local', version: 'v3' })

  const payload = await getPayload({ config })

  let curTopic: null | Topic = null
  let curTopicGroup: any = null

  for (const topicGroup of topicGroups) {
    const found = topicGroup.topics.find((topic) => topic.slug === topicSlug)

    if (found) {
      curTopic = found
      curTopicGroup = topicGroup
      break
    }
  }

  if (!curTopic) {
    notFound()
  }

  const curParsedDoc = curTopic.docs.find((doc) => doc.slug === docSlug)

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
    path: `${curTopic.slug}/${curParsedDoc.slug}`,
    title: curParsedDoc.title,
    topic: curTopic.slug,
    topicGroup: curTopicGroup.groupLabel,
    version: 'local',
  }

  if (!curDoc) {
    notFound()
  }

  return (
    <div>
      <RenderDocs
        currentDoc={curDoc as any}
        docSlug={docSlug}
        key={`${topicSlug}-${docSlug}`}
        topicGroups={topicGroups}
        topicSlug={topicSlug}
        version="local"
      >
        <Banner type="warning">You are currently viewing local documentation.</Banner>
      </RenderDocs>
    </div>
  )
}

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}
