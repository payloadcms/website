import React from 'react'
import { redirect } from 'next/navigation.js'

import { RenderDocs } from '../(current)/client_layout.js'
import { getTopics } from '../api.js'

const Layout = async ({ children }) => {
  if (process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS !== 'true') {
    redirect('/docs')
  }
  const topics = await getTopics('v2')

  return (
    <RenderDocs topics={topics} version="v2">
      {children}
    </RenderDocs>
  )
}

export default Layout
