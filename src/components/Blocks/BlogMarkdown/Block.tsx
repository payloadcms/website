import type { ReusableContent } from '@root/payload-types.js'

import Table from '@components/MDX/components/Table/index.js'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGFM from 'remark-gfm'

const components = {
  table: Table as any,
}

const remarkPlugins = [remarkGFM]

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogMarkdown' }>

const BlogMarkdown: React.FC<Props> = ({ blogMarkdownFields: { markdown } }) => {
  return <ReactMarkdown children={markdown} components={components} remarkPlugins={remarkPlugins} />
}

export default BlogMarkdown
