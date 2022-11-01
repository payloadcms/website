'use client'

import React, { useState } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import AnimateHeight from 'react-animate-height'
import Link from 'next/link'
import { Gutter } from '../../../../../components/Gutter'
import { DocMeta, Topic } from '../types'
import { ChevronIcon } from '../../../../../components/graphics/ChevronIcon'
import classes from './index.module.scss'
import { openTopicsCookieName } from '../shared'

type Props = {
  topics: Topic[]
  openTopics: string[]
  children: React.ReactNode
}

export const DocsTemplate: React.FC<Props> = ({
  topics,
  openTopics: openTopicsFromCookie,
  children,
}) => {
  const [openTopics, setOpenTopics] = useState(openTopicsFromCookie)

  return (
    <Gutter>
      <div className={classes.wrap}>
        <div className={classes.stickyWrap}>
          <nav className={classes.nav}>
            <div className={classes.navWrap}>
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
                        document.cookie = `${openTopicsCookieName}=${JSON.stringify(
                          newState,
                        )};expires=Fri, 31 Dec 9999 23:59:59 GMT`
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
            </div>
          </nav>
        </div>
        <Grid className={classes.grid}>
          <Cell start={2} startL={3} startM={1} cols={8} colsL={7} className={classes.content}>
            {children}
          </Cell>
          <Cell cols={3}>
            <aside className={classes.aside}>Hello</aside>
          </Cell>
        </Grid>
      </div>
    </Gutter>
  )
}
