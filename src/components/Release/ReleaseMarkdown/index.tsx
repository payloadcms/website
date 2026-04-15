'use client'

import Table from '@components/MDX/components/Table/index'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGFM from 'remark-gfm'

const components = {
  table: Table as any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const remarkPlugins = [remarkGFM]
const rehypePlugins = [rehypeRaw]

type Props = {
  markdown: string
}

/**
 * Strip the leading H2 from GitHub release markdown.
 * GitHub releases always start with `## [vX.Y.Z](compare-url) (date)`
 * which duplicates the page <h1> title.
 */
function stripLeadingH2(md: string): string {
  return md.replace(/^##\s+\[[^\]]*\][^\n]*\n+/, '')
}

export const ReleaseMarkdown: React.FC<Props> = ({ markdown }) => {
  return (
    <ReactMarkdown
      children={stripLeadingH2(markdown)}
      components={components}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
    />
  )
}
