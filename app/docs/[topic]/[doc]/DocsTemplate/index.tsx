'use client'

import React, { useState } from 'react'
import AnimateHeight from 'react-animate-height'
import Link from 'next/link'
import { MenuIcon } from '@components/graphics/MenuIcon'
import { CloseIcon } from '@components/graphics/CloseIcon'
import { Gutter } from '../../../../../components/Gutter'
import { DocMeta, Topic } from '../types'
import { ChevronIcon } from '../../../../../components/graphics/ChevronIcon'
import { openTopicsCookieName } from '../shared'
import { MDXProvider } from '../../../../../components/MDX'
import classes from './index.module.scss'

type Props = {
  topics: Topic[]
  openTopics: string[]
  children: React.ReactNode
  doc: string
  topic: string
}

export const DocsTemplate: React.FC<Props> = ({
  topics,
  doc: docSlug,
  topic: topicSlug,
  openTopics: openTopicsFromCookie,
  children,
}) => {
  const [openTopics, setOpenTopics] = useState(openTopicsFromCookie)
  const [navOpen, setNavOpen] = useState(false)

  return (
    <MDXProvider>
      <Gutter left="half" right="half" className={classes.wrap}>
        <nav className={[classes.nav, navOpen && classes.navOpen].filter(Boolean).join(' ')}>
          {topics.map(topic => {
            const isActive = openTopics.includes(topic.slug)
            return (
              <React.Fragment key={topic.slug}>
                <button
                  type="button"
                  className={[classes.topic, isActive && classes['topic--open']]
                    .filter(Boolean)
                    .join(' ')}
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
                    )};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`
                  }}
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
                    {topic.docs.map((doc: DocMeta) => {
                      const isDocActive = docSlug === doc.slug && topicSlug === topic.slug

                      return (
                        <li key={doc.slug}>
                          <Link
                            href={`/docs/${topic.slug.toLowerCase()}/${doc.slug}`}
                            className={[classes.doc, isDocActive && classes['doc--active']]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {doc.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </AnimateHeight>
              </React.Fragment>
            )
          })}
        </nav>
        <div className={classes.content}>{children}</div>
        <button
          type="button"
          onClick={() => setNavOpen(open => !open)}
          className={classes.mobileNavButton}
        >
          Documentation
          {!navOpen && <MenuIcon />}
          {navOpen && <CloseIcon />}
        </button>
      </Gutter>
    </MDXProvider>
  )
}
