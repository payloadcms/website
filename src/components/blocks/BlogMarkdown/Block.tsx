import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGFM from 'remark-gfm'

import Table from '@components/MDX/components/Table/index.js'
import { ReusableContent } from '@root/payload-types.js'

const components = {
  table: Table as any,
}

const remarkPlugins = [remarkGFM]

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogMarkdown' }>

const BlogMarkdown: React.FC<Props> = ({ blogMarkdownFields: { markdown } }) => {
  // @ts-expect-error
  return <ReactMarkdown children={markdown} remarkPlugins={remarkPlugins} components={components} />
}

export default BlogMarkdown
