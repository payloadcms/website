import { useAuth } from '@root/providers/Auth'
import useClickAway from '@root/utilities/use-click-away'
import Link from 'next/link'
import * as React from 'react'

import classes from './index.module.scss'

export const DropdownMenu: React.FC<{
  isOpen: boolean
  onChange: (isOpen: boolean) => void // eslint-disable-line no-unused-vars
}> = ({ isOpen: isOpenFromProps, onChange }) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = React.useState(isOpenFromProps)

  React.useEffect(() => {
    setIsOpen(isOpenFromProps)
  }, [isOpenFromProps])

  React.useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(isOpen)
    }
  }, [isOpen, onChange])

  const ref = React.useRef()

  const handleClickAway = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  useClickAway(ref, handleClickAway)

  if (isOpen) {
    return (
      <div className={classes.dropdown}>
        <div>
          <p className={classes.dropdownLabel}>Personal account</p>
          <Link href="/dashboard" className={classes.profileLink}>
            <div className={classes.profileAvatar}>
              <div className={classes.userInitial}>{user.email.charAt(0).toUpperCase()}</div>
            </div>
            <p className={classes.profileName}>{user.email}</p>
          </Link>
        </div>
        <div>
          <p className={classes.dropdownLabel}>Teams</p>
          <Link href="/dashboard/trbl" className={classes.profileLink}>
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
