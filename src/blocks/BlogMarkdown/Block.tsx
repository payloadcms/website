import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGFM from 'remark-gfm'

import { Gutter } from '@components/Gutter'
import Table from '@components/MDX/components/Table'
import { ReusableContent } from '@root/payload-types'

const components = {
  table: Table as any,
}

const remarkPlugins = [remarkGFM]

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogMarkdown' }>

const BlogMarkdown: React.FC<Props> = ({ blogMarkdownFields: { markdown } }) => {
  return (
    <Gutter>
      <div className={'grid'}>
        <div className={'cols-8 start-5 cols-m-6 start-m-2 cols-s-8 start-s-1'}>
          <ReactMarkdown
            children={markdown}
            remarkPlugins={remarkPlugins}
            components={components}
          />
        </div>
      </div>
    </Gutter>
  )
}

export default BlogMarkdown
