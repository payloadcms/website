import { notFound, redirect } from 'next/navigation'

import { getTopics } from '../api'

export default async function DocTopic({ params: { topic: topicSlug } }) {
  const topics = await getTopics()
  const topic = topics.find(({ slug }) => slug.toLowerCase() === topicSlug)
  const firstDocInTopic = topic?.docs[0]?.slug

  if (!topic || !firstDocInTopic) notFound()

  redirect(`/docs/${topicSlug}/${firstDocInTopic}`)
}

export async function generateStaticParams() {
  const topics = await getTopics()

  return topics.map(({ slug }) => ({
    topic: slug.toLowerCase(),
  }))
}
