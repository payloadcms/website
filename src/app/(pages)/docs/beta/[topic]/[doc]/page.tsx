import React from 'react'
import { notFound } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { fetchRelatedThreads } from '../../../../../_graphql'
import { RenderDoc } from '../../../(current)/[topic]/[doc]/client_page'
import { getDoc, getTopics } from '../../../api'
import { NextDoc } from '../../../types.js'

const Doc = async ({ params }) => {
  const { topic, doc: docSlug } = params
  const doc = await getDoc({ topic, doc: docSlug }, 'beta')
  const topics = await getTopics('beta')

  const relatedThreads = await fetchRelatedThreads()

  const filteredRelatedThreads = relatedThreads.filter(
    thread =>
      Array.isArray(thread.relatedDocs) &&
      thread.relatedDocs.some(
        relatedDoc => typeof relatedDoc !== 'string' && relatedDoc.title === doc?.title,
      ),
  )

  const parentTopicIndex = topics.findIndex(
    ({ slug: topicSlug }) => topicSlug.toLowerCase() === topic,
  )

  const parentTopic = topics[parentTopicIndex]
  const nextTopic = topics[parentTopicIndex + 1]
  let next: NextDoc | null = null

  if (parentTopic) {
    const docIndex = parentTopic?.docs.findIndex(({ slug }) => slug === docSlug)

    if (parentTopic?.docs?.[docIndex + 1]) {
      next = {
        slug: parentTopic.docs[docIndex + 1].slug.replace('.mdx', ''),
        title: parentTopic.docs[docIndex + 1].title,
        label: parentTopic.docs[docIndex + 1].label,
        topic: parentTopic.slug,
      }
    } else if (nextTopic?.docs?.[0]) {
      next = {
        slug: nextTopic.docs[0].slug.replace('.mdx', ''),
        title: nextTopic.docs[0].title,
        label: nextTopic.docs[0].label,
        topic: nextTopic.slug,
      }
    }
  }

  if (!doc) notFound()

  return <RenderDoc doc={doc} next={next} relatedThreads={filteredRelatedThreads} version="beta" />
}

export default Doc

type Param = {
  topic: string
  doc: string
}

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS) return []
  if (process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true') return []

  const topics = await getTopics('beta')

  const result = topics.reduce((params: Param[], topic) => {
    return params.concat(
      topic.docs
        .map(doc => {
          if (!doc.slug) return null as any

          return {
            topic: topic.slug.toLowerCase(),
            doc: doc.slug,
          }
        })
        .filter(Boolean),
    )
  }, [])

  return result
}

export async function generateMetadata({ params: { topic: topicSlug, doc: docSlug } }) {
  const doc = await getDoc({ topic: topicSlug, doc: docSlug }, 'beta')

  return {
    title: `${doc?.title ? `${doc.title} | ` : ''}Documentation | Payload`,
    description: doc?.desc || `Payload ${topicSlug} Documentation`,
    openGraph: mergeOpenGraph({
      title: `${doc?.title ? `${doc.title} | ` : ''}Documentation | Payload`,
      url: `/docs/beta/${topicSlug}/${docSlug}`,
      images: [
        {
          url: `/api/og?topic=${topicSlug}&title=${doc?.title}`,
        },
      ],
    }),
    robots: 'noindex, nofollow',
  }
}
