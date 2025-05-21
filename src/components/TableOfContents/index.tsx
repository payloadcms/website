/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client'

import type { Heading } from '@root/collections/Docs/types'

import React, { useEffect, useMemo, useState } from 'react'

import classes from './index.module.scss'

export type Props = {
  className?: string
  headings: Heading[]
}

export const TableOfContents: React.FC<Props> = ({ className = '', headings }) => {
  const [onViewport, setOnViewport] = useState<null | string>(null)
  const [hovered, setHovered] = useState<null | string>(null)

  const activeId = hovered ?? onViewport

  const offsetTop = useMemo(() => {
    if (!activeId) {
      return 0
    }
    const toc = document.getElementById('toc')
    const el = toc?.querySelector(`a[href="#${activeId}"]`) as HTMLAnchorElement
    const rect = el.getBoundingClientRect()
    const tocRect = toc?.getBoundingClientRect()
    return rect.top - (tocRect?.top ?? 0)
  }, [activeId])

  useEffect(() => {
    const handleScroll = () => {
      setHovered(null)
      for (const { anchor } of headings) {
        const el = document.getElementById(anchor)
        const rect = el?.getBoundingClientRect()
        if (rect && rect.top >= 70 && rect.bottom <= window.innerHeight) {
          setOnViewport(anchor)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial run

    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  return (
    <nav className={[classes.wrap, className].filter(Boolean).join(' ')} id="toc">
      <h6 className={classes.tocTitle}>On this page</h6>
      <ul className={classes.toc} onMouseLeave={() => setHovered(null)}>
        {headings.map(({ anchor, level, text }) => {
          const isActive = anchor === activeId
          return (
            <div
              className={[classes[`heading-${level}`], isActive && classes.active]
                .filter(Boolean)
                .join(' ')}
              key={anchor}
              onMouseEnter={() => setHovered(anchor)}
            >
              <a className={classes.link} href={`#${anchor}`}>
                {text}
              </a>
            </div>
          )
        })}
      </ul>
      <div className={classes.indicator} style={{ top: offsetTop }} />
    </nav>
  )
}
