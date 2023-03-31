import React from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'

import { CMSLink } from '@components/CMSLink'
import { SquareCardProps } from '../types'

import classes from './index.module.scss'

export const SquareCard: React.FC<SquareCardProps> = props => {
  const { title, className, leader, description, appearance } = props

  const hasLink = props.link.url || props.link.reference

  return (
    <div
      className={[
        className,
        classes.card,
        !hasLink && classes.noLink,
        appearance && classes[appearance],
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CMSLink className={classes.link} {...props.link}>
        <div className={classes.bg} />
        {leader && <span className={classes.leader}>{leader}</span>}
        <div className={classes.spacer} />
        <div className={classes.content}>
          <div className={classes.titleWrapper}>
            <h3 className={classes.title}>{title}</h3>
            {description && <div className={classes.description}>{description}</div>}
          </div>
        </div>
        <ArrowIcon className={classes.arrow} />
      </CMSLink>
    </div>
  )
}
