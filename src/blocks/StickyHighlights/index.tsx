import React from 'react'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { Page } from '@root/payload-types'
import { Gutter } from '@components/Gutter'
import { useWindowInfo } from '@faceless-ui/window-info'
import classes from './index.module.scss'
import { StickyHighlight } from './Highlight'

type Props = Extract<Page['layout'][0], { blockType: 'stickyHighlights' }>

export const StickyHighlights: React.FC<Props> = ({ stickyHighlightsFields }) => {
  const { highlights } = stickyHighlightsFields
  const { yDirection } = useScrollInfo()
  const {
    breakpoints: { m },
  } = useWindowInfo()

  return (
    <Gutter className={classes.stickyHighlights}>
      {highlights.map((highlight, i) => {
        return <StickyHighlight yDirection={yDirection} midBreak={m} key={i} {...highlight} />
      })}
    </Gutter>
  )
}
