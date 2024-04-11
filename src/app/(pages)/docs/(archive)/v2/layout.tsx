import React from 'react'
import { redirect } from 'next/navigation'

import { RenderDocs } from '../../(current)/client_layout'
import { getTopics } from '../../api'

const Layout = async ({ children }) => {
  if (process.env.NEXT_PUBLIC_HIDE_ARCHIVE_DOCS) {
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
