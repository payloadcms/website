'use client'
import React, { useEffect, useMemo, useState } from 'react'

import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme/index.js'
import { Page } from '@root/payload-types.js'
import { useThemePreference } from '@root/providers/Theme/index.js'

import classes from './index.module.scss'

export type Settings = Extract<
  Page['layout'][0],
  { blockType: 'cardGrid' }
>['cardGridFields']['settings']

export type PaddingProps = {
  top?: 'large' | 'small' | 'hero'
  bottom?: 'large' | 'small'
}

type Props = {
  settings: Settings
  className?: string
  children: React.ReactNode
  padding?: PaddingProps
  hideBackground?: boolean
  /**
   * Controls whether or not to set the padding or just provide the css variables
   *
   * Useful for complex components that need to set padding on a child element
   */
  setPadding?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const BlockWrapper: React.FC<Props> = ({
  settings,
  className,
  children,
  padding,
  setPadding = true,
  hideBackground,
  ...rest
}) => {
  const [themeState, setThemeState] = useState<Page['hero']['theme']>(settings?.theme)
  const { theme: themeFromContext } = useThemePreference()
  const theme = settings?.theme

  useEffect(() => {
    if (settings?.theme) setThemeState(settings.theme)
    else {
      if (themeFromContext) setThemeState(themeFromContext)
    }
  }, [settings, themeFromContext])

  return (
    <ChangeHeaderTheme theme={themeState ?? 'light'}>
      <div
        className={[
          classes.blockWrapper,
          theme && classes[`theme-${theme}`],
          padding?.top && classes[`padding-top-${padding?.top}`],
          padding?.bottom && classes[`padding-bottom-${padding?.bottom}`],
          setPadding && classes.setPadding,
          hideBackground && classes.hideBackground,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        {children}
      </div>
    </ChangeHeaderTheme>
  )
}
