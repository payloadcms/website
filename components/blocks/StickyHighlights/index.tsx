import React from 'react'
import { Page } from '@root/payload-types'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'stickyHighlights' }>

export const StickyHighlights: React.FC<Props> = ({ stickyHighlightsFields }) => {
  const { highlights } = stickyHighlightsFields

  return (
    <div className={classes.stickyHighlights}>
      <h1>sticky highlights</h1>
    </div>
  )
}
