import { Gutter } from '@components/Gutter'
import Table from '@components/MDX/components/Table'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { ReusableContent } from '@root/payload-types'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGFM from 'remark-gfm'

const components = {
  table: Table as any,
}

const remarkPlugins = [remarkGFM]

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogMarkdown' }>

export const BlogMarkdown: React.FC<Props> = ({ blogMarkdownFields: { markdown } }) => {
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
