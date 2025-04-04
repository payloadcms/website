'use client'

import type { TextFieldClientComponent } from 'payload'

import { CopyToClipboard, useField } from '@payloadcms/ui'

import classes from './index.module.scss'

export const Label: TextFieldClientComponent = ({ path }) => {
  const { value } = useField({ path })
  return (
    <span className={classes.label}>
      Add to Docs <CopyToClipboard value={value as string} />
    </span>
  )
}
