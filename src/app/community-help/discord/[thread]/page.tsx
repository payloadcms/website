import React from 'react'
import { notFound } from 'next/navigation'
import { getThread, getAllThreads } from '../../api'
import { RenderThread } from './render'

const Thread = async ({ params }) => {
  const { thread: slug } = params
  const thread = await getThread(slug)

  if (!thread) return notFound()

  return <RenderThread {...thread} />
}

export default Thread

export async function generateStaticParams() {
  const threads = await getAllThreads()

  return (
    threads?.map(({ slug }) => ({
      thread: slug,
    })) ?? []
  )
}
