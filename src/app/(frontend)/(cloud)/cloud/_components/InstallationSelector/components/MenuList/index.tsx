import React from 'react'
import { components } from 'react-select'

import classes from './index.module.scss'

export const MenuList: React.FC<any> = (props) => {
  const { children, href, openPopupWindow } = props

  return (
    <components.MenuList {...props}>
      {children}
      {/* use an anchor tag with an href despite the onClick for better UX */}
      <a className={classes.addAccountButton} href={href} onClick={openPopupWindow}>
        Install GitHub app
      </a>
    </components.MenuList>
  )
}
