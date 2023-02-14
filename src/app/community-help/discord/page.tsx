import { Gutter } from '@components/Gutter'
import React from 'react'
import { getAllThreads } from '../api'

const Page = async () => {
  const threads = await getAllThreads()

  return (
    <Gutter>
      <h1>Discord Threads</h1>
      <ul>
        {threads.map((thread, i) => {
          return (
            <li key={i}>
              <a href={`/community-help/discord/${thread.info.id}`}>{thread.info.name}</a>
            </li>
          )
        })}
      </ul>
    </Gutter>
  )
}

export default Page
