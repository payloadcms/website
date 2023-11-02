'use client'

import React, { useEffect, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { ChevronIcon } from '@graphics/ChevronIcon'
import { MenuIcon } from '@graphics/MenuIcon'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'

import { CloseIcon } from '@root/icons/CloseIcon'
import { MDXProvider } from '../../../components/MDX'
import { DocMeta, Topic } from './types'

import classes from './index.module.scss'

const openTopicsLocalStorageKey = 'docs-open-topics' as const

type Props = {
  topics: Topic[]
  children: React.ReactNode
}

type RenderSidebarProps = {
  topics: Topic[]
  openTopicPreferences?: string[]
  setOpenTopicPreferences: (topics: string[]) => void
  init?: boolean
  nesting: number
}
export const RenderSidebarTopics: React.FC<RenderSidebarProps> = ({
  topics,
  setOpenTopicPreferences,
  openTopicPreferences,
  init,
  nesting,
}) => {
  const [currentTopicIsOpen, setCurrentTopicIsOpen] = useState(true)
  const [...params] = useSelectedLayoutSegments()
  const middleParams = params[1].split('/')

  return (
    <>
      {topics.map(topic => {
        const topicSlug = topic.slug.toLowerCase()
        const isCurrentTopic = params[0] === topicSlug || params[1] === topicSlug
        const isActive =
          openTopicPreferences?.includes(topicSlug) || (isCurrentTopic && currentTopicIsOpen)

        return (
          <React.Fragment key={topic.slug}>
            <button
              type="button"
              className={[classes.topic, isActive && classes['topic--open']]
                .filter(Boolean)
                .join(' ')}
              style={nesting >= 1 ? { marginLeft: 8, marginTop: 5 } : {}}
              onClick={() => {
                if (isCurrentTopic) {
                  if (openTopicPreferences?.includes(topicSlug) && currentTopicIsOpen) {
                    const newState = [...openTopicPreferences]
                    newState.splice(newState.indexOf(topicSlug), 1)

                    setOpenTopicPreferences(newState)
                    window.localStorage.setItem(openTopicsLocalStorageKey, JSON.stringify(newState))
                  }
                  setCurrentTopicIsOpen(state => !state)
                } else {
                  const newState = [...(openTopicPreferences || [])]

                  if (!newState.includes(topicSlug)) {
                    newState.push(topicSlug)
                  } else {
                    newState.splice(newState.indexOf(topicSlug), 1)
                  }

                  setOpenTopicPreferences(newState)
                  window.localStorage.setItem(openTopicsLocalStorageKey, JSON.stringify(newState))
                }
              }}
            >
              <ChevronIcon
                style={nesting >= 1 ? { marginRight: 3 } : {}}
                className={[classes.toggleChevron, isActive && classes.activeToggleChevron]
                  .filter(Boolean)
                  .join(' ')}
              />
              {topic.slug.replace('-', ' ')}
            </button>
            <AnimateHeight height={isActive ? 'auto' : 0} duration={init ? 200 : 0}>
              <ul className={classes.docs}>
                {topic.docs.map((doc: DocMeta) => {
                  // Check if doc slug matches, and if topic matches
                  const isDocActive =
                    params.join('/') === doc.path + doc.slug &&
                    (middleParams.length >= 2
                      ? middleParams[middleParams.length - 2]
                      : params[0] === topicSlug)

                  if ('docs' in doc && doc?.docs) {
                    return (
                      <RenderSidebarTopics
                        topics={[doc as Topic]}
                        setOpenTopicPreferences={setOpenTopicPreferences}
                        openTopicPreferences={openTopicPreferences}
                        init={init}
                        key={doc.slug}
                        nesting={nesting + 1}
                      />
                    )
                  }
                  return (
                    <li key={doc.slug}>
                      <Link
                        href={`/docs/${doc?.path + doc?.slug}`}
                        className={[classes.doc, isDocActive && classes['doc--active']]
                          .filter(Boolean)
                          .join(' ')}
                        prefetch={false}
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
    </>
  )
}

export const RenderDocs: React.FC<Props> = ({ topics, children }) => {
  const [topicParam] = useSelectedLayoutSegments()
  const [openTopicPreferences, setOpenTopicPreferences] = useState<string[]>()
  const [init, setInit] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  useEffect(() => {
    const preference = window.localStorage.getItem(openTopicsLocalStorageKey)

    if (preference) {
      setOpenTopicPreferences(JSON.parse(preference))
    } else {
      setOpenTopicPreferences([topicParam])
    }
  }, [topicParam])

  useEffect(() => {
    if (openTopicPreferences && !init) {
      setInit(true)
    }
  }, [openTopicPreferences, init])

  return (
    <MDXProvider>
      <div className={classes.wrap}>
        <nav
          className={[
            classes.nav,
            !openTopicPreferences && classes.navHidden,
            navOpen && classes.navOpen,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <RenderSidebarTopics
            topics={topics}
            setOpenTopicPreferences={setOpenTopicPreferences}
            openTopicPreferences={openTopicPreferences}
            init={init}
            nesting={0}
          />
          <div className={classes.navOverlay} />
        </nav>
        <div className={classes.content}>{children}</div>
        <button
          type="button"
          onClick={() => setNavOpen(open => !open)}
          className={classes.mobileNavButton}
        >
          Documentation
          {!navOpen && <MenuIcon />}
          {navOpen && <CloseIcon size="large" />}
        </button>
      </div>
      ;
    </MDXProvider>
  )
}
