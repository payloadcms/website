import * as React from 'react'
import { ReusableContent } from '../../payload-types'
import { CheckmarkIcon } from '../graphics/CheckmarkIcon'
import { useTheme } from '../providers/Theme'
import RichText from '../RichText'

import classes from './index.module.scss'

export type Props = {
  type: Extract<ReusableContent['layout'][0], { blockType: 'banner' }>['bannerFields']['type']
  content: Extract<ReusableContent['layout'][0], { blockType: 'banner' }>['bannerFields']['content']
  icon?: 'checkmark'
}

const Icons = {
  checkmark: CheckmarkIcon,
}

export const Banner: React.FC<Props> = ({ content, icon, type }) => {
  const theme = useTheme()

  const Icon = icon && Icons[icon]

  return (
    <div
      className={[classes.banner, classes[type], classes[`theme--${theme}`]]
        .filter(Boolean)
        .join(' ')}
    >
      {Icon && <Icon className={classes.icon} />}

      <RichText content={content} />
    </div>
  )
}
