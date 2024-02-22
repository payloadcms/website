import React from 'react'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useWindowInfo } from '@faceless-ui/window-info'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { Gutter } from '@components/Gutter'
import { Page } from '@root/payload-types'
import { StickyHighlight } from './Highlight'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'stickyHighlights' }>

export const StickyHighlights: React.FC<Props> = ({ stickyHighlightsFields }) => {
  const { highlights } = stickyHighlightsFields || {}
  const { yDirection } = useScrollInfo()
  const {
    breakpoints: { m },
  } = useWindowInfo()

  return (
    <Gutter className={classes.stickyHighlights}>
      <BackgroundGrid zIndex={0} />
      {highlights?.map((highlight, i) => {
        return <StickyHighlight yDirection={yDirection} midBreak={m} key={i} {...highlight} />
      })}
    </Gutter>
  )
}
