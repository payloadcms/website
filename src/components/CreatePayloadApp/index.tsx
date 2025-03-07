'use client'

import { CopyToClipboard } from '@components/CopyToClipboard/index'
import React from 'react'

import classes from './index.module.scss'

export type Props = {
  background?: boolean
  className?: string
  label?: string
  style?: 'cta' | 'default'
}

const CreatePayloadApp: React.FC<Props> = ({
  background = true,
  className,
  label = 'npx create-payload-app',
  style = 'default',
}) => {
  return (
    <div
      aria-label={label}
      className={[classes.cpa, classes[style], className, background && classes.background]
        .filter(Boolean)
        .join(' ')}
    >
      <p>{label}</p>
      <CopyToClipboard className={classes.copyButton} value={label} />
    </div>
  )
}

export default CreatePayloadApp
