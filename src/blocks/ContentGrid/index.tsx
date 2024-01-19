import * as React from 'react'

import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type ContentGridProps = Extract<Page['layout'][0], { blockType: 'contentGrid' }>

type CellsProps = ContentGridProps['contentGridFields'] & {
  className?: string
  darkBackground?: boolean
}

const Cells: React.FC<CellsProps> = ({
  cells,
  className,
  darkBackground,
  useLeadingHeader,
  leadingHeader,
}) => {
  return (
    <Gutter className={[classes.contentGrid, className && className].filter(Boolean).join(' ')}>
      {useLeadingHeader && <RichText className={classes.leadingHeader} content={leadingHeader} />}

      <div className={'grid'}>
        {cells?.map((cell, i) => {
          return (
            <div className={[classes.cell, 'cols-4 cols-s-8'].filter(Boolean).join(' ')} key={i}>
              <RichText className={classes.richText} content={cell.content} />
            </div>
          )
        })}
      </div>
      {darkBackground && <div className={classes.darkBg} />}
    </Gutter>
  )
}

export const ContentGrid: React.FC<ContentGridProps> = props => {
  const { contentGridFields } = props

  if (contentGridFields && contentGridFields.forceDarkBackground) {
    return (
      <div data-theme="dark">
        <div className={classes.bgExtension}>
          <Cells {...contentGridFields} darkBackground />
        </div>
      </div>
    )
  }

  return <Cells className={classes.cellsWithCurrentTheme} {...contentGridFields} />
}
