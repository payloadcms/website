'use client'
import React, { useEffect, useMemo, useState } from 'react'

import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type Settings = Extract<
  Page['layout'][0],
  { blockType: 'cardGrid' }
>['cardGridFields']['settings']

export type PaddingProps = {
  top?: 'large' | 'small'
  bottom?: 'large' | 'small'
}

type Props = {
  settings: Settings
  className?: string
  children: React.ReactNode
  padding?: PaddingProps
} & React.HTMLAttributes<HTMLDivElement>

export const BlockWrapper: React.FC<Props> = ({
  settings,
  className,
  children,
  padding,
  ...rest
}) => {
  const theme = settings?.theme

  return (
    <div
      className={[
        classes.blockWrapper,
        theme && classes[`theme-${theme}`],
        padding?.top && classes[`padding-top-${padding?.top}`],
        padding?.bottom && classes[`padding-bottom-${padding?.bottom}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {children}
    </div>
  )
}
