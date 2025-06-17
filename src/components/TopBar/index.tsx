import type { TopBar as TopBarType } from '@root/payload-types'

import { CMSLink } from '@components/CMSLink'
import { ArrowIcon } from '@icons/ArrowIcon'

import classes from './index.module.scss'

export const TopBar: React.FC<TopBarType> = ({ link, message }) => {
  const { type, label, reference, url } = link || {}

  return (
    <CMSLink className={classes.topBar} reference={reference} type={type} url={url}>
      <span className={classes.message}>{message}</span>
      <span className={classes.label}>{label}</span>
      <ArrowIcon />
    </CMSLink>
  )
}
