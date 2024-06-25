import * as React from 'react'

import useClickAway from '@root/utilities/use-click-away.js'
import { MenuContent } from './MenuContent/index.js'

import classes from './index.module.scss'

type MenuProps = React.HTMLAttributes<HTMLButtonElement> & {
  menu: React.ReactNode
  children?: React.ReactNode
}

export const DropdownMenu: React.FC<MenuProps> = ({ children, className, menu, onClick }) => {
  const [show, setShow] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useClickAway(ref, () => setShow(false))

  // do not use a `button` here bc the menu itself may contain a button or other interactive elements
  // that would cause invalid DOM nesting
  return (
    <div
      ref={ref}
      className={[classes.dropdownMenu, className, show && classes.show].filter(Boolean).join(' ')}
      role="button"
      tabIndex={0}
      onClick={() => setShow(!show)}
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
