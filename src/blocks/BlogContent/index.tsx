import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import { ReusableContent } from '@root/payload-types'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogContent' }>

export const BlogContent: React.FC<Props> = ({ blogContentFields }) => {
  return (
    <Gutter>
      <Grid>
        <Cell start={3} cols={8} startM={2} colsM={6} startS={1} colsS={8}>
          <RichText content={blogContentFields.richText} />
        </Cell>
      </Grid>
    </Gutter>
  )
}
