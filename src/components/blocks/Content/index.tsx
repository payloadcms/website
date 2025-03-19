import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import React from 'react'

import classes from './index.module.scss'

type Props = {
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'content' }>

const Columns: React.FC<Props> = ({ contentFields, padding }) => {
  const { columnOne, columnThree, columnTwo, layout, settings } = contentFields

  switch (layout) {
    case 'halfAndHalf':

    case 'twoColumns':
    case 'twoThirdsOneThird': {
      let col1Cols = 6
      let col2Cols = 6

      if (layout === 'halfAndHalf') {
        col1Cols = 8
        col2Cols = 8
      }

      if (layout === 'twoThirdsOneThird') {
        col1Cols = 11
        col2Cols = 5
      }

      return (
        <React.Fragment>
          <div className={`cols-${col1Cols} cols-m-8`}>
            <RichText content={columnOne} />
          </div>
          <div className={`cols-${col2Cols} cols-m-8`}>
            <RichText content={columnTwo} />
          </div>
        </React.Fragment>
      )
    }
    case 'oneColumn': {
      return (
        <div className={'cols-12 cols-m-8'}>
          <RichText content={columnOne} />
        </div>
      )
    }

    case 'threeColumns': {
      return (
        <React.Fragment>
          <div className={'cols-5 cols-m-8'}>
            <RichText content={columnOne} />
          </div>
          <div className={'cols-5 cols-m-8'}>
            <RichText content={columnTwo} />
          </div>
          <div className={'cols-5 cols-m-8'}>
            <RichText content={columnThree} />
          </div>
        </React.Fragment>
      )
    }

    default: {
      return null
    }
  }
}

export const ContentBlock: React.FC<Props> = (props) => {
  const {
    contentFields: { leadingHeader, settings, useLeadingHeader },
    hideBackground,
    padding,
  } = props

  return (
    <BlockWrapper hideBackground={hideBackground} padding={padding} settings={settings}>
      <BackgroundGrid zIndex={0} />
      <Gutter className={classes.contentBlock}>
        {useLeadingHeader && <RichText className={classes.leadingHeader} content={leadingHeader} />}
        <div className={'grid'}>
          <Columns {...props} />
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
