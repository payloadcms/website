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

export const Card: React.FC<Props> = props => {
  const { title, className, leader, description } = props

  return (
    <div className={[className, classes.card].filter(Boolean).join(' ')}>
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
