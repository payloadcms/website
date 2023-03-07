import React from 'react'
import { notFound } from 'next/navigation'

import { getAllThreads, getThread } from '../../api'
import { RenderThread } from './render'

const Thread = async ({ params }) => {
  const { thread: id } = params
  const thread = await getThread(id)

  if (!thread) return notFound()

  return <RenderThread {...thread} />
}

export default Thread

export async function generateStaticParams() {
  const threads = await getAllThreads()

  return (
    threads?.map(({ info }) => ({
      thread: info.id,
    })) ?? []
  )
}
