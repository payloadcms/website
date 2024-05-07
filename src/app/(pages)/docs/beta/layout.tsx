import React from 'react'
import { redirect } from 'next/navigation'

import { RenderDocs } from '../(current)/client_layout'
import { getTopics } from '../api'

const Layout = async ({ children }) => {
  if (process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true') {
    redirect('/docs')
  }
  const topics = await getTopics('beta')

  return (
    <RenderDocs topics={topics} version="beta">
      {children}
    </RenderDocs>
  )
}

export default Layout
