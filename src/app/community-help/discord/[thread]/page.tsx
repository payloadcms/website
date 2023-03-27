import React from 'react'
import { notFound } from 'next/navigation'
import { RenderThread } from './render'
import { fetchCommunityHelp, fetchCommunityHelps } from '@root/graphql'

const Thread = async ({ params }) => {
  const { thread: slug } = params

  const thread = await fetchCommunityHelp(slug)

  if (!thread) return notFound()

  return <RenderThread {...thread} />
}

export default Thread

export async function generateStaticParams() {
  const fetchedThreads = await fetchCommunityHelps()

  return fetchedThreads?.map(({ slug }) => slug) ?? []
}
