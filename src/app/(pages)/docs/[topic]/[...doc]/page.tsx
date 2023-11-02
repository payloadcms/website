import React from 'react'
import { notFound } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { fetchRelatedThreads } from '../../../../_graphql'
import { getDoc, getTopics } from '../../api'
import { NextDoc } from '../../types'
import { RenderDoc } from './client_page'

const Doc = async ({ params }) => {
  const { topic, doc: docSlugs } = params
  const fullDocSlug = topic + '/' + docSlugs.join('/')
  const doc = await getDoc({ topic, doc: fullDocSlug })
  const topics = await getTopics()

  const relatedThreads = await fetchRelatedThreads()

  const filteredRelatedThreads = relatedThreads.filter(
    thread =>
      Array.isArray(thread.relatedDocs) &&
      thread.relatedDocs.some(relatedDoc => relatedDoc.title === doc?.title),
  )

  const parentTopicIndex = topics.findIndex(
    ({ slug: topicSlug }) => topicSlug.toLowerCase() === topic,
  )

  const parentTopic = topics[parentTopicIndex]
  const nextTopic = topics[parentTopicIndex + 1]
  let next: NextDoc | null = null

  if (parentTopic) {
    const docIndex = parentTopic?.docs.findIndex(
      ({ fullSlug, slug }) => slug === fullDocSlug || fullSlug === fullDocSlug,
    )

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

  return <RenderDoc doc={doc} next={next} relatedThreads={filteredRelatedThreads} />
}

export default Doc

type Param = {
  topic: string
  doc: string[]
}

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS) return []

  const topics = await getTopics()

  function extractParams(docs, topicSlug: string, parentSlugs: string[] = []): Param[] {
    return docs.flatMap(doc => {
      // If doc has subdocs, recursively call extractParams
      if (doc.docs && doc.docs.length > 0) {
        return extractParams(doc.docs, topicSlug, [...parentSlugs, doc.slug])
      } else if (doc.slug) {
        // If there are no subdocs, add the doc (including parent slugs if any)
        return [{ topic: topicSlug.toLowerCase(), doc: [...parentSlugs, doc.slug] }]
      }
      return [] // If doc has no slug, return an empty array to avoid null values
    })
  }

  const result = topics.reduce((params: Param[], topic) => {
    const topicParams = extractParams(topic.docs, topic.slug)
    return params.concat(topicParams)
  }, [] as Param[])

  return result
}
export async function generateMetadata({ params: { topic: topicSlug, doc: docSlugs } }) {
  const fullSlug = topicSlug + '/' + docSlugs.join('/')
  const doc = await getDoc({ topic: topicSlug, doc: fullSlug })

  return {
    title: `${doc?.title ? `${doc.title} | ` : ''}Documentation | Payload CMS`,
    description: doc?.desc || `Payload CMS ${topicSlug} Documentation`,
    openGraph: mergeOpenGraph({
      title: `${doc?.title ? `${doc.title} | ` : ''}Documentation | Payload CMS`,
      url: `/docs/${topicSlug}/${fullSlug}`,
      images: [
        {
          url: `/api/og?topic=${topicSlug}&title=${doc?.title}`,
        },
      ],
    }),
  }
}
