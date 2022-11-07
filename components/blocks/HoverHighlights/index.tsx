import React from 'react'
import { Page } from '@root/payload-types'
import { Gutter } from '@components/Gutter'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>

export const HoverHighlights: React.FC<Props> = () => {
  return (
    <div className={classes.hoverHighlights}>
      <Gutter>hover highlights</Gutter>
    </div>
  )
}
