import React from 'react'
import { getTopics } from './data'

const DocsLayout = async ({ children }) => {
  const topics = await getTopics()

  console.log(topics)

  // Render topics here
  return <div>{children}</div>
}

export default DocsLayout
