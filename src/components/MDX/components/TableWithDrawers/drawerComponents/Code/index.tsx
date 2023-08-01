import Code from '@components/Code'

import classes from './index.module.scss'

export const DrawerCode = ({ content }) => {
  return <Code className={classes.drawerCode}>{content.trim()}</Code>
}
