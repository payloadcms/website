import useClickAway from '@root/utilities/use-click-away'
import * as React from 'react'

import classes from './index.module.scss'
import { MenuContent } from './MenuContent/index'

type MenuProps = {
  children?: React.ReactNode
  menu: React.ReactNode
} & React.HTMLAttributes<HTMLButtonElement>

export const DropdownMenu: React.FC<MenuProps> = ({ children, className, menu, onClick }) => {
  const [show, setShow] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useClickAway(ref, () => setShow(false))

  // do not use a `button` here bc the menu itself may contain a button or other interactive elements
  // that would cause invalid DOM nesting
  return (
    <div
      className={[classes.dropdownMenu, className, show && classes.show].filter(Boolean).join(' ')}
      onClick={() => setShow(!show)}
      ref={ref}
      role="button"
      tabIndex={0}
    >
      {children || (
        <div className={classes.threeDots}>
          <div />
          <div />
          <div />
        </div>
      )}
      {show && <MenuContent>{menu}</MenuContent>}
    </div>
  )
}
