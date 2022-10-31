import React from 'react'
import { getTopics } from './api'
import { DocsTemplate } from './DocsTemplate'

const Layout = async ({ children }) => {
  const topics = await getTopics()
  return <DocsTemplate topics={topics}>{children}</DocsTemplate>
}

export default Layout
