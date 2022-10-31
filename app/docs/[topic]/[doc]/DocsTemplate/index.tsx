'use client'

import React, { useEffect, useState } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import AnimateHeight from 'react-animate-height'
import Link from 'next/link'
import { Gutter } from '../../../../../components/Gutter'
import { DocMeta, Topic } from '../types'
import { ChevronIcon } from '../../../../../components/graphics/ChevronIcon'
import classes from './index.module.scss'
import canUseDom from '../../../../../utilities/can-use-dom'

type Props = {
  topics: Topic[]
  children: React.ReactNode
  topic: string
  doc: string
}

const localStorageKey = 'docs-open-topics'

export const DocsTemplate: React.FC<Props> = ({
  topics,
  topic: topicSlug,
  doc: docSlug,
  children,
}) => {
  const [openTopics, setOpenTopics] = useState<string[]>([])

  useEffect(() => {
    const openTopicsFromStorage: string[] = JSON.parse(
      window.localStorage.getItem(localStorageKey) || '[]',
    )
    setOpenTopics(openTopicsFromStorage)

    console.log('test')
  }, [])

  return (
    <Gutter>
      <div className={classes.wrap}>
        <div className={classes.stickyWrap}>
          <nav className={classes.nav}>
            {topics.map(topic => {
              const isActive = openTopics.includes(topic.slug)
              return (
                <div className={classes.topic} key={topic.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      const newState = [...openTopics]

                      if (!newState.includes(topic.slug)) {
                        newState.push(topic.slug)
                      } else {
                        newState.splice(newState.indexOf(topic.slug), 1)
                      }

                      setOpenTopics(newState)
                      window.localStorage.setItem(localStorageKey, JSON.stringify(newState))
                    }}
                    className={[classes.toggle, isActive && classes.activeToggle]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <ChevronIcon
                      className={[classes.toggleChevron, isActive && classes.activeToggleChevron]
                        .filter(Boolean)
                        .join(' ')}
                    />
                    {topic.slug.replace('-', ' ')}
                  </button>
                  <AnimateHeight height={isActive ? 'auto' : 0} duration={200}>
                    <ul className={classes.docs}>
                      {topic.docs.map((doc: DocMeta) => (
                        <li key={doc.slug} className={classes.docWrap}>
                          <Link
                            href="/docs/[topic]/[doc]"
                            as={`/docs/${topic.slug.toLowerCase()}/${doc.slug}`}
                            className={classes.doc}
                          >
                            {doc.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AnimateHeight>
                </div>
              )
            })}
          </nav>
        </div>
        <Grid className={classes.grid}>
          <Cell start={2} startL={3} startM={1} cols={8}>
            {children}
          </Cell>
        </Grid>
      </div>
    </Gutter>
  )
}
