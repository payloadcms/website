import * as React from 'react'
import { QuoteIcon } from '@icons/QuoteIcon'
import { formatDate } from '@utilities/format-date-time'

import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = NonNullable<
  Extract<Page['layout'][0], { blockType: 'slider' }>['sliderFields']['quoteSlides']
>[0]
export const QuoteCard: React.FC<Props> = ({ quote, leader, author, role }) => {
  return (
    <div className={classes.quoteCard}>
      <QuoteIcon className={classes.icon} />
      <div>{quote}</div>
      <div>
        <p>{author}</p>
        <p>{role}</p>
      </div>
    </div>
  )
}
