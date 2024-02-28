import React from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'

import { BackgroundScanline } from '@components/BackgroundScanline'
import { CMSLink } from '@components/CMSLink'
import { SquareCardProps } from '../types'

import classes from './index.module.scss'

export const SquareCard: React.FC<SquareCardProps> = props => {
  const { title, className, leader, description, revealDescription } = props
  const link = props.link || {}
  const hasLink = link.url || link.reference

  return hasLink ? (
    <CMSLink
      className={[className, classes.card, revealDescription ? classes.revealCard : '']
        .filter(Boolean)
        .join(' ')}
      {...props.link}
    >
      <div className={classes.leader}>
        <h6 className={classes.leaderText}>{leader}</h6>
        <ArrowIcon className={classes.icon} />
      </div>
      <h4 className={classes.title}>{title}</h4>
      <div
        className={
          revealDescription ? classes.revealDescriptionWrapper : classes.descriptionWrapper
        }
      >
        <p className={classes.description}>{description}</p>
      </div>
      <BackgroundScanline className={classes.scanlines} />
    </CMSLink>
  ) : (
    <div
      className={[className, classes.card, revealDescription ? classes.revealCard : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.leader}>
        <h6 className={classes.leaderText}>{leader}</h6>
      </div>
      <h4 className={classes.title}>{title}</h4>
      <div
        className={
          revealDescription ? classes.revealDescriptionWrapper : classes.descriptionWrapper
        }
      >
        <p className={classes.description}>{description}</p>
      </div>
      <BackgroundScanline className={classes.scanlines} />
    </div>
  )
}
