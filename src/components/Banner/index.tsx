import type { BannerBlock, ReusableContent } from '@root/payload-types'

import { CheckIcon } from '@root/icons/CheckIcon/index'
import * as React from 'react'

import { RichText } from '../RichText/index'
import classes from './index.module.scss'

export type Props = {
  checkmark?: boolean
  children?: React.ReactNode
  content?:
    | BannerBlock['content']
    | Extract<ReusableContent['layout'][0], { blockType: 'banner' }>['bannerFields']['content']
  icon?: 'checkmark'
  margin?: boolean
  marginAdjustment?: any
  type?: BannerBlock['type']
}

const Icons = {
  checkmark: CheckIcon,
}

export const Banner: React.FC<Props> = ({
  type = 'default',
  checkmark,
  children,
  content,
  icon,
  margin = true,
  marginAdjustment = {},
}) => {
  let Icon = icon && Icons[icon]
  if (!Icon && checkmark) {
    Icon = Icons.checkmark
  }

  return (
    <div
      className={[classes.banner, 'banner', type && classes[type], !margin && classes.noMargin]
        .filter(Boolean)
        .join(' ')}
      style={marginAdjustment}
    >
      {Icon && <Icon className={classes.icon} />}

      {content && <RichText content={content} />}
      {children && <div className={classes.children}>{children}</div>}
    </div>
  )
}
