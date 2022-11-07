import React from 'react'
import { Grid, Cell } from '@faceless-ui/css-grid'
import { Page } from '../../../payload-types'
import { RichText } from '../../RichText'
import { Gutter } from '../../Gutter'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

const Columns: React.FC<Props> = ({ contentFields }) => {
  const { layout, columnOne, columnTwo, columnThree } = contentFields

  switch (layout) {
    case 'oneColumn': {
      return (
        <Cell cols={9} colsM={8}>
          <RichText content={columnOne} />
        </Cell>
      )
    }

    case 'twoColumns':
    case 'halfAndHalf':
    case 'twoThirdsOneThird': {
      let col1Cols = 5
      let col2Cols = 5

      if (layout === 'halfAndHalf') {
        col1Cols = 6
        col2Cols = 6
      }

      if (layout === 'twoThirdsOneThird') {
        col1Cols = 8
        col2Cols = 4
      }

      return (
        <React.Fragment>
          <Cell cols={col1Cols} colsM={8}>
            <RichText content={columnOne} />
          </Cell>
          <Cell cols={col2Cols} colsM={8}>
            <RichText content={columnTwo} />
          </Cell>
        </React.Fragment>
      )
    }

    case 'threeColumns': {
      return (
        <React.Fragment>
          <Cell cols={4} colsM={8}>
            <RichText content={columnOne} />
          </Cell>
          <Cell cols={4} colsM={8}>
            <RichText content={columnTwo} />
          </Cell>
          <Cell cols={4} colsM={8}>
            <RichText content={columnThree} />
          </Cell>
        </React.Fragment>
      )
    }

    default: {
      return null
    }
  }
}

export const ContentBlock: React.FC<Props> = props => {
  const {
    contentFields: { useLeadingHeader, leadingHeader },
  } = props

  return (
    <Gutter className={classes.mediaBlock}>
      {useLeadingHeader && <RichText className={classes.leadingHeader} content={leadingHeader} />}
      <Grid>
        <Columns {...props} />
      </Grid>
    </Gutter>
  )
}
