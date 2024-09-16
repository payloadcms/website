'use client'
import { MenuIcon } from '@graphics/MenuIcon'
import * as Accordion from '@radix-ui/react-accordion'
import * as Portal from '@radix-ui/react-portal'
import { VersionSelector } from '@root/components/VersionSelector/index.js'
import { ChevronIcon } from '@root/icons/ChevronIcon/index.js'
import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import Link from 'next/link'
import React from 'react'
import { useEffect, useRef, useState } from 'react'

import type { Topics } from '../../app/(frontend)/(pages)/docs/api'

import classes from './index.module.scss'

const openTopicsLocalStorageKey = 'docs-open-topics'

export const DocsNavigation = ({
  currentTopic,
  params,
  topics,
  version,
}: {
  currentTopic: string
  params: { doc: string; topic: string }
  topics: Topics[]
  version?: 'beta' | 'current' | 'v2'
}) => {
  const [currentTopicIsOpen, setCurrentTopicIsOpen] = useState(true)
  const [openTopicPreferences, setOpenTopicPreferences] = useState<string[]>()
  const [init, setInit] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [resetIndicator, setResetIndicator] = useState(false)
  const [defaultIndicatorPosition, setDefaultIndicatorPosition] = useState<number | undefined>(
    undefined,
  )
  const [indicatorTop, setIndicatorTop] = useState<number | undefined>(undefined)

  const topicRefs = useRef<Record<string, HTMLButtonElement | HTMLLIElement | null>>({})

  const hideVersionSelector =
    process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true' &&
    process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS !== 'true'

  useEffect(() => {
    setNavOpen(false)
  }, [params.topic, params.doc])

  useEffect(() => {
    const preference = window.localStorage.getItem(openTopicsLocalStorageKey)
    if (preference) {
      setOpenTopicPreferences(JSON.parse(preference))
    } else {
      setOpenTopicPreferences([params.topic])
    }
  }, [params.topic])

  useEffect(() => {
    if (openTopicPreferences && !init) {
      setInit(true)
    }
  }, [openTopicPreferences, init])

  useEffect(() => {
    resetDefaultIndicator()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.topic, params.doc])

  const resetDefaultIndicator = () => {
    const topicIndex = topics.findIndex(topic => topic.slug.toLowerCase() === params.topic)
    const docIndex = topics[topicIndex].docs.findIndex(doc => doc.slug === params.doc)
    const formattedIndex = docIndex || docIndex === 0 ? `${topicIndex}-${docIndex}` : topicIndex
    const defaultIndicatorPosition = topicRefs?.current[formattedIndex]?.offsetTop || 0
    setIndicatorTop(defaultIndicatorPosition)
  }

  const handleMenuItemClick = (topicSlug: string) => {
    const isCurrentTopic = params.topic === topicSlug
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

  const isActiveTopic = (topic: string) => topic === params.topic
  const isActiveDoc = (topic: string, doc: string) => topic === params.topic && doc === params.doc

  return (
    <aside
      className={[classes.navWrap, 'cols-3 cols-m-8', navOpen ? classes.mobileNavOpen : '']
        .filter(Boolean)
        .join(' ')}
    >
      <nav className={classes.nav} onMouseLeave={() => setResetIndicator(true)}>
        {!hideVersionSelector && version && (
          <div className={classes.selector}>
            <VersionSelector initialVersion={version} />
          </div>
        )}
        <Accordion.Root
          defaultValue={
            openTopicPreferences ? [...openTopicPreferences, currentTopic] : [currentTopic]
          }
          onValueChange={value =>
            window.localStorage.setItem(openTopicsLocalStorageKey, JSON.stringify(value))
          }
          type="multiple"
        >
          {topics.map(
            (topic, index) =>
              topic && (
                <Accordion.Item key={topic.slug} value={topic.slug.toLowerCase()}>
                  <Accordion.Trigger
                    className={[
                      classes.topic,
                      isActiveTopic(topic.slug.toLowerCase()) && classes.active,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleMenuItemClick(topic.slug.toLowerCase())}
                    onMouseEnter={() => handleIndicator(`${index}`)}
                    ref={ref => {
                      topicRefs.current[index] = ref
                    }}
                  >
                    {topic.slug.replace('-', ' ')}
                    <ChevronIcon aria-hidden className={classes.chevron} size="small" />
                  </Accordion.Trigger>
                  <Accordion.Content asChild>
                    <ul className={classes.docs}>
                      {topic.docs.map((doc, docIndex) => {
                        const nestedIndex = `${index}-${docIndex}`
                        return (
                          doc && (
                            <Link
                              href={`/docs/${
                                version ? `${version}/` : ''
                              }${topic.slug.toLowerCase()}/${doc.slug.replace('.mdx', '')}`}
                              key={topic.slug + '_' + doc.slug}
                            >
                              <li
                                className={[
                                  classes.doc,
                                  isActiveDoc(
                                    topic.slug.toLowerCase(),
                                    doc.slug.replace('.mdx', ''),
                                  ) && classes.active,
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                                onMouseEnter={() => handleIndicator(nestedIndex)}
                                ref={ref => {
                                  topicRefs.current[nestedIndex] = ref
                                }}
                              >
                                {doc.label}
                              </li>
                            </Link>
                          )
                        )
                      })}
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>
              ),
          )}
        </Accordion.Root>
        {(indicatorTop || defaultIndicatorPosition) && (
          <div
            className={classes.indicator}
            style={{ top: indicatorTop || defaultIndicatorPosition }}
          />
        )}
        <div aria-hidden className={classes.navOverlay} />
        <Portal.Root className={classes.mobileNav}>
          <button
            className={classes.mobileNavButton}
            onClick={() => setNavOpen(open => !open)}
            type="button"
          >
            Documentation
            {!navOpen && <MenuIcon />}
            {navOpen && <CloseIcon size="large" />}
          </button>
        </Portal.Root>
      </nav>
    </aside>
  )
}
