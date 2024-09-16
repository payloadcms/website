import * as React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { RichText } from '@components/RichText/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'

export type ContentGridProps = Extract<Page['layout'][0], { blockType: 'contentGrid' }> & {
  padding?: PaddingProps
  hideBackground?: boolean
}

type CellsProps = ContentGridProps['contentGridFields'] & {
  className?: string
}

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
  padding,
  hideBackground,
}) => {
  const { settings, style: styleFromProps, content, links } = contentGridFields || {}

  const hasLinks = Array.isArray(links) && links.length > 0
  const style = styleFromProps ?? 'gridBelow'

  return (
    <BlockWrapper
      settings={settings}
      padding={{ ...padding, top: 'large' }}
      hideBackground={hideBackground}
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
                    key={index}
                    appearance="default"
                    fullWidth
                    buttonProps={{
                      icon: 'arrow',
                      hideHorizontalBorders: true,
                      hideBottomBorderExceptLast: true,
                    }}
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
