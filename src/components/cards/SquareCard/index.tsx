import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { CMSLink } from '@components/CMSLink/index'
import { ArrowIcon } from '@icons/ArrowIcon/index'
import React from 'react'

import type { SquareCardProps } from '../types'

import classes from './index.module.scss'

export const SquareCard: React.FC<SquareCardProps> = (props) => {
  const { className, description, enableLink, leader, revealDescription, title } = props
  const link = props.link || {}
  const hasLink = enableLink

  return hasLink ? (
    <CMSLink
      className={[
        className,
        enableLink && classes.link,
        classes.card,
        revealDescription ? classes.revealCard : '',
      ]
        .filter(Boolean)
        .join(' ')}
      {...props.link}
    >
      <div className={classes.leader}>
        <h6 className={classes.leaderText}>{leader}</h6>
        <ArrowIcon className={classes.icon} />
      </div>
      <div className={classes.titleWrapper}>
        <h4 className={classes.title}>{title}</h4>
      </div>
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
      <div className={classes.titleWrapper}>
        <h4
          className={[classes.title, description ? '' : classes.noDescription]
            .filter(Boolean)
            .join(' ')}
        >
          {title}
        </h4>
      </div>
      {description && (
        <div
          className={
            revealDescription ? classes.revealDescriptionWrapper : classes.descriptionWrapper
          }
        >
          <p className={classes.description}>{description}</p>
        </div>
      )}
      <BackgroundScanline className={classes.scanlines} />
    </div>
  )
}
