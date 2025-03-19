import { cloudSlug } from '@cloud/slug'
import { useAuth } from '@root/providers/Auth/index'
import useClickAway from '@root/utilities/use-click-away'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import classes from './index.module.scss'

export const DropdownMenu: React.FC<{
  isOpen: boolean
  onChange: (isOpen: boolean) => void
}> = ({ isOpen: isOpenFromProps, onChange }) => {
  const { user } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(isOpenFromProps)

  React.useEffect(() => {
    setIsOpen(isOpenFromProps)
  }, [isOpenFromProps])

  React.useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(isOpen)
    }
  }, [isOpen, onChange])

  const ref = React.useRef<HTMLDivElement>(null)

  const handleClickAway = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useClickAway(ref, handleClickAway)

  if (isOpen) {
    return (
      <div className={classes.dropdown} ref={ref}>
        <div>
          <p className={classes.dropdownLabel}>Personal account</p>
          <Link className={classes.profileLink} href={`/${cloudSlug}`} prefetch={false}>
            <div className={classes.profileAvatar}>
              <div className={classes.userInitial}>{user?.email?.charAt(0).toUpperCase()}</div>
            </div>
            <p className={classes.profileName}>{user?.email}</p>
          </Link>
        </div>
        <div>
          <p className={classes.dropdownLabel}>Teams</p>
          <Link className={classes.profileLink} href={`/${cloudSlug}`} prefetch={false}>
            <div className={classes.profileAvatar}>
              <div className={classes.userInitial}>T</div>
            </div>
            <p className={classes.profileName}>TRBL</p>
          </Link>
        </div>
      </div>
    )
  }

  return null
}
