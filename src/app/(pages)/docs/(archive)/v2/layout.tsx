import React from 'react'

import { RenderDocs } from '../../(current)/client_layout'
import { getTopics } from '../../api'

const Layout = async ({ children }) => {
  const topics = await getTopics('v2')

  return (
    <RenderDocs topics={topics} version="v2">
      {children}
    </RenderDocs>
  )
}

export default Layout
