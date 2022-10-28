import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import { ReusableContent } from '../../../payload-types'
import Code from '../../Code'
import { Gutter } from '../../Gutter'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'code' }>

export const CodeBlock: React.FC<Props> = ({ codeFields }) => {
  const {
    code,
    // language
  } = codeFields

  return (
    <Gutter>
      <Grid>
        <Cell start={3} cols={8} startM={2} colsM={6} startS={1} colsS={8}>
          <Code>{code}</Code>
        </Cell>
      </Grid>
    </Gutter>
  )
}
