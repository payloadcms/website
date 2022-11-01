import React from 'react'
import { Jumplist } from '../Jumplist'
import { Heading } from '../../app/docs/[topic]/[doc]/types'
import classes from './index.module.scss'

export type Props = {
  className?: string
  headings: Heading[]
}

const TableOfContents: React.FC<Props> = ({ className, headings }) => {
  if (headings?.length > 0) {
    return (
      <div className={[classes.wrap, className].filter(Boolean).join(' ')}>
        <h5 className={classes.tocTitle}>On this page</h5>
        <Jumplist
          className={classes.toc}
          list={headings.map(({ id, level, text }) => ({
            id,
            Component: ({ active }) => (
              <div
                className={[classes[`heading-${level}`], active && classes.active]
                  .filter(Boolean)
                  .join(' ')}
              >
                {text}
              </div>
            ),
          }))}
        />
      </div>
    )
  }

  return null
}

export default TableOfContents
