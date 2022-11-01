import React from 'react'
import { getTopics } from './api'
import { DocsTemplate } from './DocsTemplate'

const Layout = async ({ params, children }) => {
  const topics = await getTopics()

  return (
    <DocsTemplate {...{ topics, openTopics: [], doc: params.doc, topic: params.topic }}>
      {children}
    </DocsTemplate>
  )
}

export default Layout
