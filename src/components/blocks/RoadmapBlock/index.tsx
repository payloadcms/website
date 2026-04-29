'use client'

import type { PaddingProps, Settings } from '@components/BlockWrapper/index'

import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import React, { useEffect, useState } from 'react'

import type { RoadmapItem } from './types'

import classes from './index.module.scss'
import { RoadmapCard } from './RoadmapCard'

type RichTextContent = {
  root: {
    children: unknown[]
    direction: ('ltr' | 'rtl') | null
    format: '' | 'center' | 'end' | 'justify' | 'left' | 'right' | 'start'
    indent: number
    type: string
    version: number
  }
}

type ColumnField = {
  heading?: RichTextContent
}

export type RoadmapBlockProps = {
  blockType: 'roadmap'
  hideBackground?: boolean
  padding: PaddingProps
  roadmapFields: {
    laterColumn?: ColumnField
    nextColumn?: ColumnField
    nowColumn?: ColumnField
    richText?: RichTextContent
    settings?: Settings
    showPriorityBadges?: boolean | null
  }
}

type RoadmapData = {
  P0: RoadmapItem[]
  P1: RoadmapItem[]
  P2: RoadmapItem[]
}

export const RoadmapBlock: React.FC<RoadmapBlockProps> = (props) => {
  const {
    hideBackground,
    padding,
    roadmapFields: { laterColumn, nextColumn, nowColumn, richText, settings, showPriorityBadges },
  } = props

  const [roadmapData, setRoadmapData] = useState<null | RoadmapData>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/roadmap')
        const data = await response.json()
        setRoadmapData(data)
      } catch (error) {
        console.error('Failed to fetch roadmap data:', error)
        setRoadmapData({ P0: [], P1: [], P2: [] })
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [])

  const priorities = [
    {
      column: nowColumn,
      defaultDescription: 'Actively in development',
      defaultLabel: 'Now',
      key: 'P0' as const,
    },
    {
      column: nextColumn,
      defaultDescription: 'Coming up next',
      defaultLabel: 'Next',
      key: 'P1' as const,
    },
    {
      column: laterColumn,
      defaultDescription: 'On our roadmap',
      defaultLabel: 'Later',
      key: 'P2' as const,
    },
  ]

  return (
    <BlockWrapper
      className={classes.roadmapBlock}
      hideBackground={hideBackground}
      padding={{ ...padding, top: 'large' }}
      settings={settings}
    >
      <Gutter>
        {richText && (
          <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.richText, 'cols-12 cols-m-8'].filter(Boolean).join(' ')}>
              <RichText content={richText} />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className={classes.loading}>Loading roadmap...</div>
        ) : (
          <div className={[classes.roadmapWrapper, 'grid'].filter(Boolean).join(' ')}>
            {priorities.map(({ column, defaultDescription, defaultLabel, key }) => {
              const items = roadmapData?.[key]

              if (!items || items.length === 0) {
                return null
              }

              return (
                <div
                  className={[classes.column, 'cols-5 cols-m-8'].filter(Boolean).join(' ')}
                  key={key}
                >
                  <div
                    className={[classes.columnHeader, classes[`columnHeader--${key.toLowerCase()}`]].join(' ')}
                  >
                    {column?.heading ? (
                      <RichText content={column.heading} />
                    ) : (
                      <>
                        <h3 className={classes.columnTitle}>{defaultLabel}</h3>
                        <p className={classes.columnDescription}>{defaultDescription}</p>
                      </>
                    )}
                  </div>

                  <div className={classes.cards}>
                    {items.map((item) => (
                      <RoadmapCard
                        item={item}
                        key={item.number}
                        showPriorityBadge={showPriorityBadges ?? false}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
