'use client'

import type { Heading } from '@root/collections/Docs/types'

import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import classes from './index.module.scss'

export type Props = {
  className?: string
  headings: Heading[]
}

/**
 * returns the height at which the ToC indicator should be.
 * Currently the top position. We could make it cover all visible headings, as fumadocs does.
 */
const useTocIndicator = (headings: Heading[]) => {
  const [onViewport, setOnViewport] = useReducer(() => {
    for (const { anchor } of headings) {
      const el = document.getElementById(anchor)
      const rect = el?.getBoundingClientRect()
      if (rect && rect.top >= 70) {
        return anchor
      }
    }
  }, null)

  const topPosition = useMemo(() => {
    if (!onViewport) {
      return 0
    }
    const toc = document.getElementById('toc')
    // This is the "ToC heading" which refers to the first "article heading" to appear from the top of the viewport.
    const firstOnViewport = toc?.querySelector(`a[href="#${onViewport}"]`) as HTMLAnchorElement
    const rect = firstOnViewport.getBoundingClientRect()
    const tocRect = toc?.getBoundingClientRect()
    return rect.top - (tocRect?.top ?? 0)
  }, [onViewport])

  useEffect(() => {
    window.addEventListener('scroll', setOnViewport)
    setOnViewport() // Initial run
    return () => window.removeEventListener('scroll', setOnViewport)
  }, [setOnViewport, headings])

  return topPosition
}

export const TableOfContents: React.FC<Props> = ({ className = '', headings }) => {
  const position = useTocIndicator(headings)

  return (
    <nav className={[classes.wrap, className].filter(Boolean).join(' ')} id="toc">
      <h6 className={classes.tocTitle}>On this page</h6>
      <ul className={classes.toc}>
        {headings.map(({ anchor, level, text }) => {
          return (
            <li className={classes[`heading-${level}`]} key={anchor}>
              <a className={classes.link} href={`#${anchor}`}>
                {text}
              </a>
            </li>
          )
        })}
      </ul>
      <div className={classes.indicator} style={{ top: position }} />
    </nav>
  )
}
