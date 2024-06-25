import * as React from 'react'
import { QuoteIcon } from '@icons/QuoteIcon/index.js'
import { formatDate } from '@utilities/format-date-time.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { RichText } from '@components/RichText/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'

type Props = NonNullable<
  Extract<Page['layout'][0], { blockType: 'slider' }>['sliderFields']['quoteSlides']
>[0] & {
  isActive: boolean
}

export const QuoteCard: React.FC<Props> = ({ quote, leader, author, role, isActive }) => {
  if (!quote) return null
  return (
    <div className={[classes.quoteCard, isActive && classes.isActive].filter(Boolean).join(' ')}>
      <div className={classes.leader}>{leader}</div>
      <h3 className={classes.quote}>
        {quote}
        <span className={classes.closingQuote}>”</span>
      </h3>
      <div className={classes.meta}>
        <p className={classes.author}>{author}</p>
        <p className={classes.role}>{role}</p>
      </div>
    </div>
  )
}
