import React from 'react'
import { getAllDiscussions } from '../api'

const Page = async () => {
  const discussions = await getAllDiscussions()

  return (
    <>
      <div>Discussions archive</div>
      <ul>
        {discussions.map((discussion, i) => {
          return <li key={i}>{discussion.title}</li>
        })}
      </ul>
    </>
  )
}

export default Page
