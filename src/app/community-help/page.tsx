import { Gutter } from '@components/Gutter'
import React from 'react'
import { getAllDiscussions, getAllThreads } from './api'

const Page = async () => {
  const discussions = await getAllDiscussions()
  const threads = await getAllThreads()

  return (
    <Gutter>
      <h1>GitHub Discussions</h1>
      <ul>
        {discussions.map((discussion, i) => {
          if (i < 10)
            return (
              <li key={i}>
                <a href={`/community-help/github/${discussion.id}`}>{discussion.title}</a>
              </li>
            )
          return null
        })}
      </ul>

      <h1>Discord</h1>
      <ul>
        {threads.map((thread, i) => {
          if (i < 10)
            return (
              <li key={i}>
                <a href={`/community-help/discord/${thread.info.id}`}>{thread.info.name}</a>
              </li>
            )
          return null
        })}
      </ul>
    </Gutter>
  )
}

export default Page
