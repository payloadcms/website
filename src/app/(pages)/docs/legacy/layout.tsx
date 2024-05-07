import React from 'react'
import { redirect } from 'next/navigation'

import { RenderDocs } from '../(current)/client_layout'
import { getTopics } from '../api'

const Layout = async ({ children }) => {
  if (process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS !== 'true') {
    redirect('/docs')
  }
  const topics = await getTopics('legacy')

  return (
    <RenderDocs topics={topics} version="legacy">
      {children}
    </RenderDocs>
  )
}

export default Layout
