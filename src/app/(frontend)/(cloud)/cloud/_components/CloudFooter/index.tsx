'use client'

import type { Theme } from '@root/providers/Theme/types'

import { Gutter } from '@components/Gutter/index'
import { ThemeAutoIcon } from '@root/graphics/ThemeAutoIcon/index'
import { ThemeDarkIcon } from '@root/graphics/ThemeDarkIcon/index'
import { ThemeLightIcon } from '@root/graphics/ThemeLightIcon/index'
import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon/index'
import { useAuth } from '@root/providers/Auth/index'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index'
import { useThemePreference } from '@root/providers/Theme/index'
import { getImplicitPreference, themeLocalStorageKey } from '@root/providers/Theme/shared'
import Link from 'next/link'
import React, { useId } from 'react'

import classes from './classes.module.scss'

export const CloudFooter = () => {
  const { user } = useAuth()

  const selectRef = React.useRef<HTMLSelectElement>(null)
  const themeId = useId()
  const { setTheme } = useThemePreference()
  const { setHeaderTheme } = useHeaderObserver()

  const onThemeChange = (themeToSet: 'auto' & Theme) => {
    if (themeToSet === 'auto') {
      const implicitPreference = getImplicitPreference() ?? 'light'
      setHeaderTheme(implicitPreference)
      setTheme(implicitPreference)
      if (selectRef.current) {
        selectRef.current.value = 'auto'
      }
    } else {
      setTheme(themeToSet)
      setHeaderTheme(themeToSet)
    }
  }

  return (
    <Gutter className={classes.footerWrap}>
      <footer className={['grid', classes.footer].join(' ')}>
        <nav className={['cols-12 cols-m-6', classes.footerLinks].join(' ')}>
          <Link href={'/docs'}>Docs</Link>
          <Link href={'/cloud-terms'}>Terms</Link>
          <Link href={'/privacy'}>Privacy</Link>
          {user ? <Link href={'/logout'}>Logout</Link> : <Link href={'/login'}>Login</Link>}
        </nav>
        <div className={[classes.selectContainer, 'cols-4 cols-m-2'].join(' ')}>
          <label className="visually-hidden" htmlFor={themeId}>
            Switch themes
          </label>
          {selectRef?.current && (
            <div className={`${classes.switcherIcon} ${classes.themeIcon}`}>
              {selectRef.current.value === 'auto' && <ThemeAutoIcon />}
              {selectRef.current.value === 'light' && <ThemeLightIcon />}
              {selectRef.current.value === 'dark' && <ThemeDarkIcon />}
            </div>
          )}

          <select
            id={themeId}
            onChange={(e) => onThemeChange(e.target.value as 'auto' & Theme)}
            ref={selectRef}
          >
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <ChevronUpDownIcon className={`${classes.switcherIcon} ${classes.upDownChevronIcon}`} />
        </div>
      </footer>
    </Gutter>
  )
}
