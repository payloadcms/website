import React from 'react'
import { Page } from '@root/payload-types'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>

export const HoverHighlights: React.FC<Props> = ({ hoverHighlightsFields }) => {
  const { richText, addRowNumbers, highlights } = hoverHighlightsFields

  return (
    <div className={classes.hoverHighlights}>
      <h1>hover highlights</h1>
    </div>
  )
}
