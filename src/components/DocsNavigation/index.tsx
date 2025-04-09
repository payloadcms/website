'use client'
import type { DocsVersion } from '@components/RenderDocs'

import { MenuIcon } from '@graphics/MenuIcon'
import * as Accordion from '@radix-ui/react-accordion'
import * as Portal from '@radix-ui/react-portal'
import { VersionSelector } from '@root/components/VersionSelector/index'
import { ChevronIcon } from '@root/icons/ChevronIcon/index'
import { CloseIcon } from '@root/icons/CloseIcon/index'
import Link from 'next/link'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import type { TopicGroupForNav } from '../../collections/Docs/types'

import classes from './index.module.scss'

const openTopicsLocalStorageKey = 'docs-open-topics'

export const DocsNavigation = ({
  currentDoc,
  currentTopic,
  docIndex,
  groupIndex,
  indexInGroup,
  topics,
  version,
}: {
  currentDoc: string
  currentTopic: string
  docIndex: number
  groupIndex: number
  indexInGroup: number
  topics: TopicGroupForNav[]
  version?: DocsVersion
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
  }, [currentTopic, currentDoc])

  useEffect(() => {
    const preference = window.localStorage.getItem(openTopicsLocalStorageKey)
    if (preference) {
      setOpenTopicPreferences(JSON.parse(preference))
    } else {
      setOpenTopicPreferences([currentTopic])
    }
  }, [currentTopic])

  useEffect(() => {
    if (openTopicPreferences && !init) {
      setInit(true)
    }
  }, [openTopicPreferences, init])

  useEffect(() => {
    resetDefaultIndicator()
  }, [currentTopic, currentDoc])

  useEffect(() => {
    if (init) {
      const formattedIndex =
        typeof docIndex === 'number' ? `${groupIndex}-${indexInGroup}-${docIndex}` : groupIndex
      const offset = topicRefs?.current[formattedIndex]?.offsetTop || 0
      setIndicatorTop(offset)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init])

  const resetDefaultIndicator = () => {
    const formattedIndex =
      typeof docIndex === 'number' ? `${groupIndex}-${indexInGroup}-${docIndex}` : groupIndex
    const defaultIndicatorPosition = topicRefs?.current[formattedIndex]?.offsetTop || 0
    setIndicatorTop(defaultIndicatorPosition)
  }

  const handleMenuItemClick = (topicSlug: string) => {
    const isCurrentTopic = currentTopic === topicSlug
    if (isCurrentTopic) {
      if (openTopicPreferences?.includes(topicSlug) && currentTopicIsOpen) {
        const newState = [...openTopicPreferences]
        newState.splice(newState.indexOf(topicSlug), 1)

        setOpenTopicPreferences(newState)
        window.localStorage.setItem(openTopicsLocalStorageKey, JSON.stringify(newState))
      }
      setCurrentTopicIsOpen((state) => !state)
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

  const isActiveTopic = (topic: string) => topic === currentTopic
  const isActiveDoc = (topic: string, doc: string) => topic === currentTopic && doc === currentDoc

  return (
    openTopicPreferences && (
      <aside
        className={[classes.navWrap, 'cols-3 cols-m-8', navOpen ? classes.mobileNavOpen : '']
          .filter(Boolean)
          .join(' ')}
      >
        <nav className={classes.nav} onMouseLeave={() => setResetIndicator(true)}>
          {!hideVersionSelector && (
            <div className={classes.selector}>
              <VersionSelector initialVersion={version ?? 'current'} />
            </div>
          )}
          <Accordion.Root
            onValueChange={(value) => {
              // We only want to have one topic open at a time,
              // so we'll always set the last value in the array
              const newValue =
                Array.isArray(value) && value.length > 0 ? [value[value.length - 1]] : value
              window.localStorage.setItem(openTopicsLocalStorageKey, JSON.stringify(newValue))
              setOpenTopicPreferences(newValue)
            }}
            type="multiple"
            value={openTopicPreferences}
          >
            {topics.map((tGroup, groupIndex) => (
              <Fragment key={`group-${groupIndex}`}>
                <span className={classes.groupLabel}>{tGroup.groupLabel}</span>
                {tGroup.topics.map(
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
                          onMouseEnter={() => handleIndicator(`${groupIndex}-${index}`)}
                          ref={(ref) => {
                            topicRefs.current[`${groupIndex}-${index}`] = ref
                          }}
                        >
                          {(topic.label || topic.slug)?.replace('-', ' ')}
                          <ChevronIcon aria-hidden className={classes.chevron} size="small" />
                        </Accordion.Trigger>
                        <Accordion.Content asChild>
                          <ul className={classes.docs}>
                            {topic.docs.map((doc, docIndex) => {
                              const nestedIndex = `${groupIndex}-${index}-${docIndex}`
                              return (
                                doc && (
                                  <Link
                                    href={`/docs/${
                                      version ? `${version}/` : ''
                                    }${topic.slug.toLowerCase()}/${doc.slug.replace('.mdx', '')}`}
                                    key={`${topic.slug}_${doc.slug}`}
                                    prefetch={false}
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
                                      ref={(ref) => {
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
                {groupIndex < topics.length - 1 && <div className={classes.divider} />}
              </Fragment>
            ))}
          </Accordion.Root>
          {indicatorTop || defaultIndicatorPosition ? (
            <div
              className={classes.indicator}
              style={{ top: indicatorTop || defaultIndicatorPosition }}
            />
          ) : null}
          <div aria-hidden className={classes.navOverlay} />
          <Portal.Root className={classes.mobileNav}>
            <button
              className={classes.mobileNavButton}
              onClick={() => setNavOpen((open) => !open)}
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
  )
}
