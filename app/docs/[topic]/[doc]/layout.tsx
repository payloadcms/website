import React from 'react'
import { getTopics } from './api'
import { App } from '../../../App'
import { DocsTemplate } from './DocsTemplate'

const Layout = async ({ children }) => {
  const topics = await getTopics()

  return (
    <App>
      <DocsTemplate topics={topics}>{children}</DocsTemplate>
    </App>
  )
}

export default Layout
