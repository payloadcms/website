'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import classes from './index.module.scss'

type Props = {
  component: string
  example: string
  version?: string
}

const loading = () => (
  <div aria-busy="true" className={classes.unsupported}>
    Loading component example…
  </div>
)

const V3ComponentPreview = dynamic(
  () => import('./V3ComponentPreview').then((module) => module.V3ComponentPreview),
  { loading },
)

const V4ComponentPreview = dynamic(
  () => import('./V4ComponentPreview').then((module) => module.V4ComponentPreview),
  { loading },
)

export const ComponentPreview: React.FC<Props> = (props) => {
  if (props.version === 'v4') {
    return <V4ComponentPreview {...props} />
  }

  return <V3ComponentPreview {...props} />
}
