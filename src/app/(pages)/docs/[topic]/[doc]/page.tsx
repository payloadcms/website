import React from 'react'
import { notFound } from 'next/navigation'

import { getDoc, getTopics } from '../../api'
import { NextDoc } from '../../types'
import { RenderDoc } from './client_page'

const Doc = async ({ params }) => {
  const { topic, doc: docSlug } = params
  const doc = await getDoc({ topic, doc: docSlug })
  const topics = await getTopics()

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

  return <RenderDoc doc={doc} next={next} />
}

export default Doc

type Param = {
  topic: string
  doc: string
}
export async function generateStaticParams() {
  const topics = await getTopics()

  const result = topics.reduce((params: Param[], topic) => {
    return params.concat(
      topic.docs.map(doc => ({
        topic: topic.slug.toLowerCase(),
        doc: doc.slug,
      })),
    )
  }, [])

  return result
}

export async function generateMetadata({ params: { topic, doc: docSlug } }) {
  const doc = await getDoc({ topic, doc: docSlug })

  return {
    title: `${doc?.title ? `${doc.title} | ` : ''}Documentation | Payload CMS`,
    description: doc?.desc || `Payload CMS ${topic} Documentation`,
    openGraph: {
      url: `/api/og?topic=${topic}&title=${doc?.title}}`,
    },
  }
}
