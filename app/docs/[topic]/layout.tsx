import React from 'react'
import { getTopics } from '../api'
import { RenderTopic } from './render'

const Layout = async ({ params, children }) => {
  const topics = await getTopics()

  return <RenderTopic {...{ topics, topic: params.topic }}>{children}</RenderTopic>
}

export default Layout
