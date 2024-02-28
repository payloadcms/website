import React from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'

import { CMSLink } from '@components/CMSLink'
import { PricingCardProps } from '../types'

import classes from './index.module.scss'

export const PricingCard: React.FC<PricingCardProps> = props => {
  const { title, price, className, leader, description, hasPrice } = props

  const link = props.link || {}

  const hasLink = link.url || link.reference

  return (
    <div
      className={[className, classes.card, !hasLink && classes.noLink].filter(Boolean).join(' ')}
    >
      {leader && <span className={classes.leader}>{leader}</span>}
      <div className={classes.content}>
        {price && hasPrice && <h3 className={classes.price}>{price}</h3>}
        {title && !hasPrice && <h3 className={classes.title}>{title}</h3>}
        {description && <div className={classes.description}>{description}</div>}
      </div>
    </div>
  )
}
