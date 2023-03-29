import * as React from 'react'
import { CheckmarkIcon } from '@graphics/CheckmarkIcon'

import { ReusableContent } from '@root/payload-types'
import { RichText } from '../RichText'

import classes from './index.module.scss'

export type Props = {
  type?: Extract<ReusableContent['layout'][0], { blockType: 'banner' }>['bannerFields']['type']
  content?: Extract<
    ReusableContent['layout'][0],
    { blockType: 'banner' }
  >['bannerFields']['content']
  children?: React.ReactNode
  checkmark?: boolean
  icon?: 'checkmark'
}

const Icons = {
  checkmark: CheckmarkIcon,
}

export const Banner: React.FC<Props> = ({
  content,
  children,
  icon,
  type = 'default',
  checkmark,
}) => {
  let Icon = icon && Icons[icon]
  if (!Icon && checkmark) Icon = Icons.checkmark

  return (
    <div className={[classes.banner, 'banner', classes[type]].filter(Boolean).join(' ')}>
      {Icon && <Icon className={classes.icon} />}

      {content && <RichText content={content} />}
      {children && <div className={classes.children}>{children}</div>}
    </div>
  )
}
