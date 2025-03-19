'use client'

import type { ListItem } from '@components/Jumplist/types'
import type { Heading } from '@root/collections/Docs/types'

import React, { useEffect, useRef, useState } from 'react'

import { Jumplist } from '../Jumplist/index'
import classes from './index.module.scss'

export type Props = {
  className?: string
  headings: Heading[]
}

export const TableOfContents: React.FC<Props> = ({ className, headings }) => {
  const listItemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [indicatorTop, setIndicatorTop] = useState<number | undefined>(undefined)
  const [activeHeadingId, setActiveHeadingId] = useState<null | string>(null)
  const [resetIndicator, setResetIndicator] = useState(true)

  useEffect(() => {
    if (activeHeadingId !== null) {
      const offsetTop = activeHeadingId ? listItemRefs.current[activeHeadingId]?.offsetTop : 0
      setIndicatorTop(offsetTop)
    } else {
      setIndicatorTop(undefined)
    }
    if (resetIndicator) {
      setResetIndicator(false)
    }
  }, [activeHeadingId, headings, resetIndicator])

  const [list, setList] = useState<ListItem[]>([])

  useEffect(() => {
    setList(
      headings.map(({ anchor, level, text }) => ({
        id: anchor,
        anchor,
        Component: ({ active }) => {
          useEffect(() => {
            if (active) {
              setActiveHeadingId(anchor)
            }
          }, [active])

          const handleMouseEnter = () => {
            const offsetTop = listItemRefs.current[anchor]?.offsetTop || 0
            setIndicatorTop(offsetTop)
          }
          return (
            <div
              className={[classes[`heading-${level}`], active && classes.active]
                .filter(Boolean)
                .join(' ')}
              key={anchor}
              onMouseEnter={handleMouseEnter}
              ref={(ref) => {
                listItemRefs.current[anchor] = ref
              }}
            >
              {text}
            </div>
          )
        },
      })),
    )
  }, [headings])

  return headings?.length > 0 ? (
    <div
      className={[classes.wrap, className].filter(Boolean).join(' ')}
      onMouseLeave={() => setResetIndicator(true)}
    >
      <h6 className={classes.tocTitle}>On this page</h6>
      <Jumplist className={classes.toc} list={list} />
      {indicatorTop !== undefined && (
        <div className={classes.indicator} style={{ top: indicatorTop }} />
      )}
    </div>
  ) : null
}
