import React, { useEffect, useRef, useState } from 'react'

import { Heading } from '@root/app/(pages)/docs/types'
import { Jumplist } from '../Jumplist'

import classes from './index.module.scss'

export type Props = {
  className?: string
  headings: Heading[]
}

const TableOfContents: React.FC<Props> = ({ className, headings }) => {
  const listItemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [indicatorTop, setIndicatorTop] = useState<number | undefined>(undefined)
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null)
  const [resetIndicator, setResetIndicator] = useState(true)

  useEffect(() => {
    if (activeHeadingId !== null) {
      const offsetTop = activeHeadingId ? listItemRefs.current[activeHeadingId]?.offsetTop : 0
      setIndicatorTop(offsetTop)
    } else {
      setIndicatorTop(undefined)
    }
    resetIndicator && setResetIndicator(false)
  }, [activeHeadingId, headings, resetIndicator])

  return headings?.length > 0 ? (
    <div
      className={[classes.wrap, className].filter(Boolean).join(' ')}
      onMouseLeave={() => setResetIndicator(true)}
    >
      <h5 className={classes.tocTitle}>On this page</h5>
      <Jumplist
        className={classes.toc}
        list={headings.map(({ id, level, text }) => ({
          id,
          Component: ({ active }) => {
            if (active) {
              setActiveHeadingId(id)
            }
            const handleMouseEnter = () => {
              const offsetTop = listItemRefs.current[id]?.offsetTop || 0
              setIndicatorTop(offsetTop)
            }
            return (
              <div
                key={id}
                className={[classes[`heading-${level}`], active && classes.active]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={handleMouseEnter}
                ref={ref => (listItemRefs.current[id] = ref)}
              >
                {text}
              </div>
            )
          },
        }))}
      />
      {indicatorTop !== undefined && (
        <div className={classes.indicator} style={{ top: indicatorTop }} />
      )}
    </div>
  ) : null
}

export default TableOfContents
