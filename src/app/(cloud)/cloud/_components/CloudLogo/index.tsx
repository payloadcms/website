import { PayloadIcon } from '@root/graphics/PayloadIcon'

import classes from './classes.module.scss'

export const CloudLogo = () => {
  return (
    <div className={classes.cloudLogo}>
      <PayloadIcon />
      <span>Payload Cloud</span>
    </div>
  )
}
