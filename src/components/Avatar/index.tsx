import * as React from 'react'
import Link from 'next/link'

import { useAuth } from '@root/providers/Auth'

// import { DropdownMenu } from './DropdownMenu'
import classes from './index.module.scss'

export const Avatar: React.FC = () => {
  const { user } = useAuth()

  // const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={classes.avatar}>
      {/* <button
        type="button"
        className={classes.button}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className={classes.primaryUser}>
          <div className={classes.userInitial}>{user.email.charAt(0).toUpperCase()}</div>
        </div>
      </button>
      <DropdownMenu isOpen={isOpen} onChange={setIsOpen} /> */}
      <Link href="/dashboard">
        <div className={classes.primaryUser}>
          <div className={classes.userInitial}>{user?.email?.charAt(0).toUpperCase()}</div>
        </div>
      </Link>
    </div>
  )
}
