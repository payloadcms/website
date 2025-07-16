'use client'
import type { Page } from '@root/payload-types'

import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme/index'
import { useThemePreference } from '@root/providers/Theme/index'
import React, { useEffect, useMemo, useState } from 'react'

import classes from './index.module.scss'

export type Settings = Extract<
  Page['layout'][0],
  { blockType: 'cardGrid' }
>['cardGridFields']['settings']

export type PaddingProps = {
  bottom?: 'large' | 'small'
  top?: 'hero' | 'large' | 'small'
}

type Props = {
  children: React.ReactNode
  className?: string
  hero?: boolean
  hideBackground?: boolean
  padding?: PaddingProps
  /**
   * Controls whether or not to set the padding or just provide the css variables
   *
   * Useful for complex components that need to set padding on a child element
   */
  setPadding?: boolean
  settings: Settings
} & React.HTMLAttributes<HTMLDivElement>

export const BlockWrapper: React.FC<Props> = ({
  children,
  className,
  hero = false,
  hideBackground,
  padding,
  setPadding = true,
  settings,
  ...rest
}) => {
  const [themeState, setThemeState] = useState<Page['hero']['theme']>(settings?.theme)
  const { theme: themeFromContext } = useThemePreference()
  const theme = settings?.theme

  useEffect(() => {
    if (settings?.theme) {
      setThemeState(settings.theme)
    } else {
      if (themeFromContext) {
        setThemeState(themeFromContext)
      }
    }
  }, [settings, themeFromContext])

  return (
    <ChangeHeaderTheme theme={themeState ?? 'light'}>
      <div
        className={[
          classes.blockWrapper,
          hero && 'hero',
          theme && classes[`theme-${theme}`],
          padding?.top && classes[`padding-top-${padding?.top}`],
          padding?.bottom && classes[`padding-bottom-${padding?.bottom}`],
          setPadding && classes.setPadding,
          settings?.background && classes[`background-${settings.background}`],
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
