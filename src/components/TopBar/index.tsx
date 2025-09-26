import type { TopBar as TopBarType } from '@root/payload-types'

import { CMSLink } from '@components/CMSLink'
import { ArrowIcon } from '@icons/ArrowIcon'

import classes from './index.module.scss'

export const TopBar: React.FC<TopBarType> = ({ link, message }) => {
  return (
    link && (
      <CMSLink className={classes.topBar} {...link} label={undefined}>
        <span className={classes.message}>{message}</span>
        <span className={classes.label}>{link.label}</span>
        <ArrowIcon />
      </CMSLink>
    )
  )
}
