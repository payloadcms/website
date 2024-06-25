import { PayloadIcon } from '@root/graphics/PayloadIcon/index.js'

import classes from './classes.module.scss'

export const CloudLogo = () => {
  return (
    <div className={classes.cloudLogo}>
      <PayloadIcon />
      <span>Payload Cloud</span>
    </div>
  )
}
