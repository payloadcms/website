import React from 'react'

import { getTopics } from './api'
import { RenderDocs } from './render'

const Layout = async ({ children }) => {
  const topics = await getTopics()
  return <RenderDocs topics={topics}>{children}</RenderDocs>
}

export default Layout
