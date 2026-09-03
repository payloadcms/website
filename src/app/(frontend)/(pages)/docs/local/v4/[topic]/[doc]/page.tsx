import type { Topic } from '@root/collections/Docs/types'
import type { Doc } from '@root/payload-types'
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

type Params = { doc: string; topic: string }

export default async function DocsPage({ params }: { params: Promise<Params> }) {
  await headers()
  const { doc: docSlug, topic: topicSlug } = await params
  const topicGroups = await fetchDocs({ ref: 'v4', source: 'local', version: 'v4' })
  const payload = await getPayload({ config })

  let curTopic: null | Topic = null
  let curTopicGroup: (typeof topicGroups)[number] | null = null

  for (const topicGroup of topicGroups) {
    const found = topicGroup.topics.find((topic) => topic.slug === topicSlug)

    if (found) {
      curTopic = found
      curTopicGroup = topicGroup
      break
    }
  }

  if (!curTopic || !curTopicGroup) {
    notFound()
  }

  const curParsedDoc = curTopic.docs.find((doc) => doc.slug === docSlug)

  if (!curParsedDoc) {
    notFound()
  }

  const editorConfig = await sanitizeServerEditorConfig(
    {
      features: contentLexicalEditorFeatures,
    },
    payload.config,
  )
  const { editorState } = mdxToLexical({
    editorConfig,
    mdx: curParsedDoc.content,
  })

  const curDoc: RequiredDataFromCollectionSlug<'docs'> = {
    slug: curParsedDoc.slug,
    content: editorState as RequiredDataFromCollectionSlug<'docs'>['content'],
    description: curParsedDoc.desc,
    headings: curParsedDoc.headings,
    keywords: curParsedDoc.keywords,
    label: curParsedDoc.label,
    order: curParsedDoc.order,
    path: `${curTopic.slug}/${curParsedDoc.slug}`,
    title: curParsedDoc.title,
    topic: curTopic.slug,
    topicGroup: curTopicGroup.groupLabel,
    version: 'v4',
  }

  return (
    <RenderDocs
      currentDoc={curDoc as unknown as Doc}
      docSlug={docSlug}
      key={`${topicSlug}-${docSlug}`}
      topicGroups={topicGroups}
      topicSlug={topicSlug}
      version="local/v4"
    >
      <Banner type="warning">You are currently viewing local Payload 4 documentation.</Banner>
    </RenderDocs>
  )
}

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}
