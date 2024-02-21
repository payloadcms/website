'use client'
import React, { useEffect, useMemo, useState } from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { ChevronIcon } from '@root/icons/ChevronIcon'
import { Page } from '@root/payload-types'
import { useThemePreference } from '@root/providers/Theme'
import { Theme } from '@root/providers/Theme/types'

import classes from './index.module.scss'

interface Props {
  hero: Page['hero']
  breadcrumbs: Page['breadcrumbs']
}

const BreadcrumbsBar: React.FC<Props> = ({ hero, breadcrumbs: breadcrumbsProps }) => {
  const { breadcrumbsBarLinks, theme, enableBreadcrumbsBar, type } = hero
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Page['hero']['theme']>(theme)

  const hasBackground = !Boolean(['home'].includes(type))

  useEffect(() => {
    if (!hasBackground) {
      setThemeState('dark')
    } else {
      if (theme) setThemeState(theme)
      else if (themeFromContext) setThemeState(themeFromContext)
    }
  }, [themeFromContext, theme])

  const breadcrumbs = useMemo(() => {
    return breadcrumbsProps?.slice(0, breadcrumbsProps.length - 1) ?? []
  }, [breadcrumbsProps])

  return (
    <ChangeHeaderTheme theme={themeState ?? !hasBackground ? 'dark' : 'light'}>
      <div
        className={[classes.wrapper, hasBackground && classes.hasBackground]
          .filter(Boolean)
          .join(' ')}
        {...(themeState ? { 'data-theme': themeState } : {})}
      >
        <Gutter>
          {enableBreadcrumbsBar ? (
            <>
              <div className={classes.container}>
                <div>{breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}</div>

                <div className={classes.links}>
                  {Array.isArray(breadcrumbsBarLinks) &&
                    breadcrumbsBarLinks.map(({ link }, i) => {
                      return (
                        <CMSLink
                          className={classes.link}
                          key={i}
                          {...link}
                          appearance={undefined}
                        />
                      )
                    })}
                </div>
              </div>

              <div className={classes.containerMobile}>
                <details className={classes.dropdown}>
                  <summary>
                    {breadcrumbsProps?.[breadcrumbsProps.length - 1].label}{' '}
                    <ChevronIcon className={classes.icon} />{' '}
                  </summary>
                  <div className={classes.dropdownContent}>
                    {Array.isArray(breadcrumbs) &&
                      breadcrumbs.map(({ url, label }, i) => {
                        return (
                          <CMSLink
                            className={classes.link}
                            key={i}
                            url={url}
                            label={label}
                            appearance={undefined}
                          />
                        )
                      })}
                    {Array.isArray(breadcrumbsBarLinks) &&
                      breadcrumbsBarLinks.map(({ link }, i) => {
                        return (
                          <CMSLink
                            className={classes.link}
                            key={i}
                            {...link}
                            appearance={undefined}
                          />
                        )
                      })}
                  </div>
                </details>
              </div>
            </>
          ) : (
            <div className={classes.emptyBar} />
          )}
        </Gutter>
      </div>
    </ChangeHeaderTheme>
  )
}

export default BreadcrumbsBar
