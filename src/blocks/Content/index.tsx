import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'content' }> & {
  padding: PaddingProps
}

const Columns: React.FC<Props> = ({ contentFields, padding }) => {
  const { layout, columnOne, columnTwo, columnThree, settings } = contentFields

  switch (layout) {
    case 'oneColumn': {
      return (
        <div className={'cols-12 cols-m-8'}>
          <RichText content={columnOne} />
        </div>
      )
    }

    case 'twoColumns':
    case 'halfAndHalf':
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

export const ContentBlock: React.FC<Props> = props => {
  const {
    contentFields: { useLeadingHeader, leadingHeader, settings },
    padding,
  } = props

  return (
    <BlockWrapper padding={padding} settings={settings}>
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
