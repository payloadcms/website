import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import * as React from 'react'

import classes from './index.module.scss'

export type ContentGridProps = {
  hideBackground?: boolean
  padding?: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'contentGrid' }>

type CellsProps = {
  className?: string
} & ContentGridProps['contentGridFields']

const Cells: React.FC<CellsProps> = ({ cells, className, showNumbers, style: styleFromProps }) => {
  const style = styleFromProps ?? 'gridBelow'

  return (
    <div
      className={[classes.cellGrid, 'grid', style === 'gridBelow' ? 'cols-16 cols-m-8' : 'cols-8']
        .filter(Boolean)
        .join(' ')}
    >
      {cells?.map((cell, i) => {
        return (
          <div
            className={[classes.cell, style === 'sideBySide' ? 'cols-8' : 'cols-4 cols-s-8']
              .filter(Boolean)
              .join(' ')}
            key={i}
          >
            {showNumbers && <p className={classes.leader}>0{++i}</p>}
            <RichText className={classes.cellRichText} content={cell.content} />
          </div>
        )
      })}
    </div>
  )
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  contentGridFields,
  hideBackground,
  padding,
}) => {
  const { content, links, settings, style: styleFromProps } = contentGridFields || {}

  const hasLinks = Array.isArray(links) && links.length > 0
  const style = styleFromProps ?? 'gridBelow'

  return (
    <BlockWrapper
      hideBackground={hideBackground}
      padding={{ ...padding, top: 'large' }}
      settings={settings}
    >
      <BackgroundGrid zIndex={0} />
      <Gutter className={[classes.wrapper, classes[style], 'grid'].filter(Boolean).join(' ')}>
        <div
          className={[
            classes.topContent,
            classes[style],
            'grid',
            style === 'gridBelow' ? 'cols-16 cols-m-8' : 'cols-8',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content && (
            <RichText
              className={[classes.richText, style === 'sideBySide' ? 'cols-12' : 'cols-8']
                .filter(Boolean)
                .join(' ')}
              content={content}
            />
          )}
          {hasLinks && (
            <div
              className={[
                classes.linksWrapper,
                style === 'sideBySide' ? 'cols-8' : 'cols-4 start-13 cols-l-4 cols-m-8 start-m-1',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {links.map(({ link }, index) => {
                return (
                  <CMSLink
                    {...link}
                    appearance="default"
                    buttonProps={{
                      hideBottomBorderExceptLast: true,
                      hideHorizontalBorders: true,
                      icon: 'arrow',
                    }}
                    fullWidth
                    key={index}
                  />
                )
              })}
            </div>
          )}
        </div>

        <Cells {...contentGridFields} />
      </Gutter>
    </BlockWrapper>
  )
}
