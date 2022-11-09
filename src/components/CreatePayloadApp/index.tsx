import CopyToClipboard from '@components/CopyToClipboard'
import React from 'react'
import classes from './index.module.scss'

export type Props = {
  className?: string
  background?: boolean
}

const CreatePayloadApp: React.FC<Props> = ({ className, background = true }) => {
  return (
    <div
      className={[classes.cpa, className, background && classes.background]
        .filter(Boolean)
        .join(' ')}
    >
      <p>npx create-payload-app</p>
      <CopyToClipboard className={classes.copyButton} value="npx create-payload-app" />
    </div>
  )
}

export default CreatePayloadApp
