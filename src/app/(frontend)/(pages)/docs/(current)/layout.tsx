import React from 'react'

import { getTopics } from '../api.js'
import { RenderDocs } from './client_layout.js'

const Layout = async ({ children }) => {
  const topics = await getTopics()
  return <RenderDocs topics={topics}>{children}</RenderDocs>
}

export default Layout
