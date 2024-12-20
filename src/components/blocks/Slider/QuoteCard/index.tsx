import type { Page } from '@root/payload-types.js'

import { CMSLink } from '@components/CMSLink'
import { Media } from '@components/Media'
import { ArrowIcon } from '@icons/ArrowIcon'
import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  isActive: boolean
} & NonNullable<
  Extract<Page['layout'][0], { blockType: 'slider' }>['sliderFields']['quoteSlides']
>[0]

export const QuoteCard: React.FC<Props> = ({
  author,
  enableLink,
  isActive,
  link,
  logo,
  quote,
  role,
}) => {
  if (!quote) {return null}

  return (
    <div className={[classes.quoteCard, isActive && classes.isActive].filter(Boolean).join(' ')}>
      <h3 className={classes.quote}>
        <span className={classes.closingQuote}>“</span>
        {quote}
        <span className={classes.closingQuote}>”</span>
      </h3>
      <div className={classes.credit}>
        {author}
        {role && <span>, {role}</span>}
      </div>
      <div className={classes.logoWrap}>
        {logo && typeof logo !== 'string' && (
          <Media alt={author} className={classes.logo} resource={logo} />
        )}
        {enableLink && (
          <CMSLink className={classes.arrowWrap} {...link} label={null}>
            {link?.label && <span className={classes.linkLabel}>{link.label}</span>}
            <div className={classes.arrow}>
              <ArrowIcon />
            </div>
          </CMSLink>
        )}
      </div>
    </div>
  )
}
