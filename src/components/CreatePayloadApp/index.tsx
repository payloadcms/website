'use client'

import React from 'react'

import { CopyToClipboard } from '@components/CopyToClipboard/index.js'

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
  label = 'npx create-payload-app',
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
