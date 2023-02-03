import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Cell, Grid } from '@faceless-ui/css-grid'
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
      <Grid>
        <Cell start={3} cols={8} startM={2} colsM={6} startS={1} colsS={8}>
          <ReactMarkdown
            children={markdown}
            remarkPlugins={remarkPlugins}
            components={components}
          />
        </Cell>
      </Grid>
    </Gutter>
  )
}

export default BlogMarkdown
