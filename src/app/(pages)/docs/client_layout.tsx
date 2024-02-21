'use client'

import React, { useEffect, useRef, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { MenuIcon } from '@root/graphics/MenuIcon'
import { CloseIcon } from '@root/icons/CloseIcon'
import { MDXProvider } from '../../../components/MDX'
import { DocMeta, Topic } from './types'

import classes from './index.module.scss'

const openTopicsLocalStorageKey = 'docs-open-topics'

type Props = {
  topics: Topic[]
  children: React.ReactNode
}

export const RenderDocs: React.FC<Props> = ({ topics, children }) => {
  const [topicParam, docParam] = useSelectedLayoutSegments()
  const [currentTopicIsOpen, setCurrentTopicIsOpen] = useState(true)
  const [openTopicPreferences, setOpenTopicPreferences] = useState<string[]>()
  const [init, setInit] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const pathname = usePathname()
  const [resetIndicator, setResetIndicator] = useState(false)
  const [defaultIndicatorPosition, setDefaultIndicatorPosition] = useState<number | undefined>(
    undefined,
  )
  const [indicatorTop, setIndicatorTop] = useState<number | undefined>(undefined)

  const topicRefs = useRef<(HTMLButtonElement | null)[]>([])

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

  useEffect(() => {
    if (topicParam && docParam) {
      const topicIndex = topics.findIndex(topic => topic.slug.toLowerCase() === topicParam)
      const docIndex = topics[topicIndex].docs.findIndex(doc => doc.slug === docParam)
      handleIndicator(topicIndex, docIndex, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTopicPreferences, topicParam, docParam, topics])

  useEffect(() => {
    if (resetIndicator) {
      setIndicatorTop(defaultIndicatorPosition)
      setResetIndicator(false)
    }
  }, [resetIndicator, defaultIndicatorPosition])

  const handleMenuItemClick = (topicSlug: string, docIndex: number) => {
    const isCurrentTopic = topicParam === topicSlug
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
  }

  const handleIndicator = (index: number, docIndex?: number, setDefault?: boolean) => {
    const topicHeight = topicRefs?.current[index]?.offsetTop || 0
    const nestedOffset = currentTopicIsOpen && docIndex ? (docIndex + 1) * 28 : 0

    if (setDefault) {
      setDefaultIndicatorPosition(topicHeight + nestedOffset)
      setIndicatorTop(topicHeight + nestedOffset)
    } else {
      setIndicatorTop(topicHeight + nestedOffset)
    }
  }

  return (
    <MDXProvider>
      <div className={['grid', classes.wrap].join(' ')}>
        <BackgroundGrid wideGrid />
        <nav
          className={[
            'cols-3',
            classes.nav,
            !openTopicPreferences && classes.navHidden,
            navOpen && classes.navOpen,
          ]
            .filter(Boolean)
            .join(' ')}
          onMouseLeave={() => setResetIndicator(true)}
        >
          {topics.map((topic, index) => {
            const topicSlug = topic.slug.toLowerCase()
            const isActive =
              openTopicPreferences?.includes(topicSlug) ||
              (topicParam === topicSlug && currentTopicIsOpen)

            return (
              <React.Fragment key={topic.slug}>
                <button
                  type="button"
                  className={[classes.topic, isActive && classes['topic--open']]
                    .filter(Boolean)
                    .join(' ')}
                  ref={ref => (topicRefs.current[index] = ref)}
                  onClick={() => handleMenuItemClick(topicSlug, index)}
                  onMouseEnter={() => handleIndicator(index, undefined)}
                >
                  {topic.slug.replace('-', ' ')}
                </button>
                <AnimateHeight height={isActive ? 'auto' : 0} duration={init ? 200 : 0}>
                  <ul className={classes.docs}>
                    {topic.docs.map((doc: DocMeta, docIndex) => {
                      const isDocActive = docParam === doc.slug && topicParam === topicSlug
                      return (
                        <li key={doc.slug} onMouseEnter={() => handleIndicator(index, docIndex)}>
                          <Link
                            href={`/docs/${topicSlug}/${doc.slug}`}
                            className={[classes.doc, isDocActive && classes['doc--active']]
                              .filter(Boolean)
                              .join(' ')}
                            prefetch={false}
                            onClick={() => handleIndicator(index, docIndex, true)}
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
          {(indicatorTop || defaultIndicatorPosition) && (
            <div
              className={classes.indicator}
              style={{ top: indicatorTop || defaultIndicatorPosition }}
            />
          )}
          <div className={classes.navOverlay} />
        </nav>
        {children}
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
    </MDXProvider>
  )
}
