import React from 'react'
import { notFound } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { fetchRelatedThreads } from '../../../../../_graphql/index.js'
import { getDoc, getTopics } from '../../../api.js'
import { NextDoc } from '../../../types.js'
import { RenderDoc } from './client_page.js'
import { MDXRemote } from 'next-mdx-remote/rsc'
import components from '@components/MDX/components/index.js'
import remarkGfm from 'remark-gfm'

const Doc = async props => {
  const { params } = props
  const { topic, doc: docSlug } = params
  const doc = await getDoc({ topic, doc: docSlug })
  const topics = await getTopics()

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

  return (
    <RenderDoc doc={doc} next={next} relatedThreads={filteredRelatedThreads}>
      <MDXRemote
        source={doc.content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </RenderDoc>
  )
}

export default Doc

type Param = {
  topic: string
  doc: string
}

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS) return []

  const topics = await getTopics()

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
  const doc = await getDoc({ topic: topicSlug, doc: docSlug })

  return {
    title: `${doc?.title ? `${doc.title} | ` : ''}Documentation | Payload`,
    description: doc?.desc || `Payload ${topicSlug} Documentation`,
    openGraph: mergeOpenGraph({
      title: `${doc?.title ? `${doc.title} | ` : ''}Documentation | Payload`,
      url: `/docs/${topicSlug}/${docSlug}`,
      images: [
        {
          url: `/api/og?topic=${topicSlug}&title=${doc?.title}`,
        },
      ],
    }),
  }
}
