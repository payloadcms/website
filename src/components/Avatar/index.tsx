import { useAuth } from '@root/providers/Auth'
import useClickAway from '@root/utilities/use-click-away'
import * as React from 'react'

import classes from './index.module.scss'
import { DropdownMenu } from './DropdownMenu'

export const Avatar: React.FC = () => {
  const { user } = useAuth()

  const [isOpen, setIsOpen] = React.useState(false)

  const ref = React.useRef()

  const handleClickAway = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  useClickAway(ref, handleClickAway)

  return (
    <div className={classes.avatar}>
      <button
        type="button"
        className={classes.button}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        ref={ref}
      >
        <div className={classes.primaryUser}>
          <div className={classes.userInitial}>{user.email.charAt(0).toUpperCase()}</div>
        </div>
      </button>
      <DropdownMenu isOpen={isOpen} onChange={setIsOpen} />
    </div>
  )
}
