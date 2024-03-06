import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGFM from 'remark-gfm'

import Table from '@components/MDX/components/Table'
import { ReusableContent } from '@root/payload-types'

const components = {
  table: Table as any,
}

const remarkPlugins = [remarkGFM]

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogMarkdown' }>

const BlogMarkdown: React.FC<Props> = ({ blogMarkdownFields: { markdown } }) => {
  return <ReactMarkdown children={markdown} remarkPlugins={remarkPlugins} components={components} />
}

export default BlogMarkdown
