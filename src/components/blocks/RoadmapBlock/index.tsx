'use client'

import type { PaddingProps, Settings } from '@components/BlockWrapper/index'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import React, { useEffect, useState } from 'react'

import type { RoadmapItem } from './types'

import classes from './index.module.scss'
import { RoadmapCard } from './RoadmapCard'

export type RoadmapBlockProps = {
  blockType: 'roadmap'
  hideBackground?: boolean
  padding: PaddingProps
  roadmapFields: {
    richText?: {
      root: {
        children: unknown[]
        direction: ('ltr' | 'rtl') | null
        format: '' | 'center' | 'end' | 'justify' | 'left' | 'right' | 'start'
        indent: number
        type: string
        version: number
      }
    }
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
    roadmapFields: { richText, settings, showPriorityBadges },
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
    { description: 'Working on or in queue', key: 'P0' as const, label: 'In Progress' },
    { description: 'Next up', key: 'P1' as const, label: 'High Priority' },
    { description: 'Planned', key: 'P2' as const, label: 'Medium Priority' },
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
            {priorities.map(({ description, key, label }) => {
              const items = roadmapData?.[key]

              if (!items || items.length === 0) {
                return null
              }

              return (
                <div
                  className={[classes.column, 'cols-5 cols-m-8'].filter(Boolean).join(' ')}
                  key={key}
                >
                  <div className={classes.columnHeader}>
                    <h3 className={classes.columnTitle}>
                      {label} <span className={classes.count}>({items.length})</span>
                    </h3>
                    <p className={classes.columnDescription}>{description}</p>
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
