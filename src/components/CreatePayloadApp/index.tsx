import React from 'react'

import { CopyToClipboard } from '@components/CopyToClipboard'

import classes from './index.module.scss'

export type Props = {
  className?: string
  background?: boolean
  style?: 'default' | 'cta'
  label?: string
}

const CreatePayloadApp: React.FC<Props> = ({
  className,
  background = true,
  style = 'default',
  label,
}) => {
  return (
    <div
      aria-label={label}
      className={[classes.cpa, classes[style], className, background && classes.background]
        .filter(Boolean)
        .join(' ')}
    >
      <p>{label}</p>
      <CopyToClipboard className={classes.copyButton} value={label ?? 'create-payload-app'} />
    </div>
  )
}

export default CreatePayloadApp
