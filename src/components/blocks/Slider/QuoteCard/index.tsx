import * as React from 'react'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'
import { Media } from '@components/Media'
import { CMSLink } from '@components/CMSLink'
import { ArrowIcon } from '@icons/ArrowIcon'

type Props = NonNullable<
  Extract<Page['layout'][0], { blockType: 'slider' }>['sliderFields']['quoteSlides']
>[0] & {
  isActive: boolean
}

export const QuoteCard: React.FC<Props> = ({
  quote,
  author,
  role,
  logo,
  isActive,
  link,
  enableLink,
}) => {
  if (!quote) return null

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
          <Media resource={logo} className={classes.logo} alt={author} />
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
