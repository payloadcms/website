import { Gutter } from '@components/Gutter'
import React from 'react'
import { getAllDiscussions } from '../api'

const Page = async () => {
  const discussions = await getAllDiscussions()

  return (
    <Gutter>
      <h1>GitHub Discussions</h1>
      <ul>
        {discussions.map((discussion, i) => {
          return (
            <li key={i}>
              <a
                href={`${process.env.NEXT_PUBLIC_SITE_URL}/community-help/github/${discussion.slug}`}
              >
                {discussion.title}
              </a>
            </li>
          )
        })}
      </ul>
    </Gutter>
  )
}

export default Page
