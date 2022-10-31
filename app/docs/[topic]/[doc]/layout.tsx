import React from 'react'
import { getTopics } from './api'
import { DocsTemplate } from './DocsTemplate'

const Layout = async ({ params, children }) => {
  const topics = await getTopics()

  console.log('rerendering')

  return (
    <DocsTemplate topics={topics} {...params}>
      {children}
    </DocsTemplate>
  )
}

export default Layout
