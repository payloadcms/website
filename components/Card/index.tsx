import { CMSLink } from '@components/CMSLink'
import { ArrowIcon } from '@components/icons/ArrowIcon'
import React from 'react'
import classes from './index.module.scss'

type Props = {
  leader?: string
  className?: string
  title: string
  description: string
  link: any
}

export const HoverContent: React.FC<Props> = props => {
  const { title, description } = props

  return (
    <div className={classes.hoverContent}>
      <div aria-hidden="true" className={classes.hoverTitle}>
        {title}
      </div>
      {description && <p className={classes.description}>{description}</p>}
      <div className={classes.hoverSpacer} />
      <ArrowIcon />
    </div>
  )
}

export const Card: React.FC<Props> = props => {
  const { title, className, leader } = props

  return (
    <div className={[className, classes.card].filter(Boolean).join(' ')}>
      <CMSLink className={classes.link} {...props.link}>
        {leader && <span className={classes.leader}>{leader}</span>}
        <div className={classes.spacer} />
        <h3 className={classes.title}>{title}</h3>
        <HoverContent {...props} />
      </CMSLink>
    </div>
  )
}
