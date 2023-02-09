import React from 'react'
import { notFound } from 'next/navigation'
import { Gutter } from '@components/Gutter'
import { getAllThreads, getThread } from '../../api'

const Thread = async ({ params }) => {
  const { thread: id } = params
  const thread = await getThread(id)

  if (!thread) return notFound()

  return (
    <Gutter>
      <a href={`${process.env.NEXT_PUBLIC_SITE_URL}/community-help/discord`}>Back</a>
      <h3>{thread.info.name}</h3>
      {thread.messages &&
        thread.messages.map((message, i) => {
          return (
            <div key={i}>
              <div>{message.content}</div>
              <h6>{message.author}</h6>
            </div>
          )
        })}
      <h5>{/* <a href={thread.info.url}>View on Discord</a> */}</h5>
    </Gutter>
  )
}

export default Thread

export async function generateStaticParams() {
  const threads = await getAllThreads()

  return threads.map(({ info }) => ({
    thread: info.id,
  }))
}
