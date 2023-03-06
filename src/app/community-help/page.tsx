import React from 'react'
import { getAllDiscussions, getAllThreads } from './api'
import { RenderCommunityHelp } from './render'

const Page = async () => {
  const discussions = await getAllDiscussions()
  const threads = await getAllThreads()
  return <RenderCommunityHelp discussions={discussions} threads={threads} />
}

export default Page
