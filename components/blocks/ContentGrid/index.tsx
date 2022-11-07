import * as React from 'react'
import { Gutter } from '@components/Gutter'
import { ThemeProvider, useTheme } from '@components/providers/Theme'
import { RichText } from '@components/RichText'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'contentGrid' }>

type CellsProps = Props['contentGridFields'] & {
  className?: string
}

const Cells = ({ cells, className }: CellsProps) => {
  return (
    <Gutter className={[classes.contentGrid, className && className].filter(Boolean).join(' ')}>
      <Grid>
        {cells.map((cell, i) => {
          return (
            <Cell className={classes.cell} cols={4} colsS={8} key={i}>
              <RichText className={classes.richText} content={cell.content} />
            </Cell>
          )
        })}
      </Grid>

      <div className={classes.bg} />
    </Gutter>
  )
}

export const ContentGrid: React.FC<Props> = props => {
  const { contentGridFields } = props
  const currentTheme = useTheme()

  if (contentGridFields.forceDarkBackground) {
    return (
      <ThemeProvider theme="dark">
        <div className={currentTheme !== 'dark' && classes.bgExtension}>
          <Cells cells={contentGridFields.cells} />
        </div>
      </ThemeProvider>
    )
  }

  return <Cells className={classes[`theme--${currentTheme}`]} cells={contentGridFields.cells} />
}
