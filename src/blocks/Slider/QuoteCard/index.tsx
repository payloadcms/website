import * as React from 'react'
import { ThemeProvider } from '@providers/Theme'

import { RichText } from '@components/RichText'
import { QuoteIcon } from '@icons/QuoteIcon'
import { Page } from '@root/payload-types'
import { formatDate } from '@utilities/format-date-time'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'slider' }>['sliderFields']['quoteSlides'][0]
export const QuoteCard: React.FC<Props> = ({ richText, quoteDate }) => {
  return (
    <ThemeProvider theme="dark" className={classes.quoteCard}>
      <QuoteIcon className={classes.icon} />
      <RichText className={classes.richText} content={richText} />
      <time className={classes.date} dateTime={quoteDate}>
        {formatDate({ date: quoteDate, format: 'shortDateStamp' })}
      </time>
    </ThemeProvider>
  )
}
