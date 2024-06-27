import { components } from 'react-select'

import classes from './index.module.scss'

export const MenuList: React.FC<any> = props => {
  const {
    selectProps: { selectProps, href },
  } = props

  return (
    <components.MenuList {...props}>
      {props.children}
      {/* use an anchor tag with an href despite the onClick for better UX */}
      <a className={classes.addAccountButton} href={href} onClick={selectProps?.openPopupWindow}>
        Install GitHub app
      </a>
    </components.MenuList>
  )
}
