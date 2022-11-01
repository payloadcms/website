import { cookies } from 'next/headers'
import React from 'react'
import { getTopics } from './api'
import { DocsTemplate } from './DocsTemplate'
import { openTopicsCookieName } from './shared'

const Layout = async ({ params, children }) => {
  const topics = await getTopics()
  const openTopics = JSON.parse(cookies().get(openTopicsCookieName)?.value || '[]')

  return <DocsTemplate {...{ topics, openTopics, doc: params.doc }}>{children}</DocsTemplate>
}

export default Layout
