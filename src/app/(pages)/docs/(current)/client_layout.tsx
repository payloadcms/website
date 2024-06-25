'use client'

import React, { useEffect, useRef, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import LinkImport from 'next/link.js'

const Link = (LinkImport.default || LinkImport) as unknown as typeof LinkImport.default
import { usePathname, useSelectedLayoutSegments } from 'next/navigation.js'

import { MDXProvider } from '@components/MDX/index.js'
import { BackgroundGrid } from '@root/components/BackgroundGrid/index.js'
import { MenuIcon } from '@root/graphics/MenuIcon/index.js'
import { ChevronIcon } from '@root/icons/ChevronIcon/index.js'
import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import { DocMeta, Topic } from '../types.js'

import classes from '../index.module.scss'

const openTopicsLocalStorageKey = 'docs-open-topics'

type Props = {
  topics: Topic[]
  children: React.ReactNode
  version?: 'current' | 'v2' | 'beta'
}

export const RenderDocs: React.FC<Props> = ({ topics, children, version = 'current' }) => {
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

  const topicRefs = useRef<Record<string, HTMLButtonElement | HTMLLIElement | null>>({})

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
    resetDefaultIndicator()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicParam, docParam])

  const resetDefaultIndicator = () => {
    const topicIndex = topics.findIndex(topic => topic.slug.toLowerCase() === topicParam)
    const docIndex = topics[topicIndex].docs.findIndex(doc => doc.slug === docParam)
    const formattedIndex = docIndex || docIndex === 0 ? `${topicIndex}-${docIndex}` : topicIndex
    const defaultIndicatorPosition = topicRefs?.current[formattedIndex]?.offsetTop || 0
    setIndicatorTop(defaultIndicatorPosition)
  }

  const handleMenuItemClick = (topicSlug: string) => {
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

  const handleIndicator = (index: number | string) => {
    const offset = topicRefs?.current[index]?.offsetTop || 0
    setIndicatorTop(offset)
  }

  useEffect(() => {
    if (resetIndicator) {
      resetDefaultIndicator()
      setResetIndicator(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetIndicator])

  return (
    <MDXProvider>
      <div className={['grid', classes.wrap].join(' ')}>
        <BackgroundGrid wideGrid className={classes.backgroundGrid} />
        <nav
          className={[
            'cols-3',
            classes.navWrap,
            !openTopicPreferences && classes.navHidden,
            navOpen && classes.navOpen,
          ]
            .filter(Boolean)
            .join(' ')}
          onMouseLeave={() => setResetIndicator(true)}
        >
          <div className={classes.nav}>
            {topics.map((topic, index) => {
              const topicSlug = topic.slug.toLowerCase()
              const isActive =
                openTopicPreferences?.includes(topicSlug) ||
                (topicParam === topicSlug && currentTopicIsOpen)
              const childIsCurrent = topicParam === topicSlug && currentTopicIsOpen

              return (
                <React.Fragment key={topic.slug}>
                  <button
                    type="button"
                    className={[classes.topic, childIsCurrent && classes['topic--active']]
                      .filter(Boolean)
                      .join(' ')}
                    ref={ref => (topicRefs.current[index] = ref)}
                    onClick={() => handleMenuItemClick(topicSlug)}
                    onMouseEnter={() => handleIndicator(`${index}`)}
                  >
                    {topic.slug.replace('-', ' ')}
                    <div className={classes.chevron}>
                      <ChevronIcon size="small" rotation={isActive ? 270 : 90} />
                    </div>
                  </button>
                  <AnimateHeight height={isActive ? 'auto' : 0} duration={init ? 200 : 0}>
                    <ul className={classes.docs}>
                      {topic.docs.map((doc: DocMeta, docIndex) => {
                        const isDocActive = docParam === doc.slug && topicParam === topicSlug
                        const nestedIndex = `${index}-${docIndex}`

                        return (
                          <li
                            key={doc.slug}
                            onMouseEnter={() => handleIndicator(nestedIndex)}
                            ref={ref => (topicRefs.current[nestedIndex] = ref)}
                          >
                            <Link
                              href={`/docs${
                                version !== 'current' ? '/' + version : ''
                              }/${topicSlug}/${doc.slug}`}
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
            {(indicatorTop || defaultIndicatorPosition) && (
              <div
                className={classes.indicator}
                style={{ top: indicatorTop || defaultIndicatorPosition }}
              />
            )}
            <div className={classes.navOverlay} />
          </div>
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
