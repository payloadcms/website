import React from 'react'
import { getDoc, getTopics } from './api'
import { DocTemplate } from './DocTemplate'

const Doc = async ({ params }) => {
  const { topic, doc: docSlug } = params
  const doc = await getDoc({ topic, doc: docSlug })
  return <DocTemplate doc={doc} />
}

export default Doc

export async function generateStaticParams() {
  const topics = await getTopics()

  const result = topics.reduce((params, topic) => {
    return params.concat(
      topic.docs.map(doc => ({
        topic: topic.slug.toLowerCase(),
        doc: doc.slug,
      })),
    )
  }, [])

  return result
}
