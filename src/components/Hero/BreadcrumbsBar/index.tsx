'use client'
import type { CMSLinkType } from '@components/CMSLink/index'
import type { Page } from '@root/payload-types'

import { Breadcrumbs } from '@components/Breadcrumbs/index'
import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { ChevronIcon } from '@root/icons/ChevronIcon/index'
import { useThemePreference } from '@root/providers/Theme/index'
import React, { useEffect, useMemo, useState } from 'react'

import classes from './index.module.scss'

interface HeroProps {
  hero: Page['hero']
  links?: never
}

interface LinksProps {
  hero?: never
  links?: CMSLinkType[]
}

type Conditional = HeroProps | LinksProps

type Props = {
  breadcrumbs?: Page['breadcrumbs']
} & Conditional

const BreadcrumbsBar: React.FC<Props> = ({
  breadcrumbs: breadcrumbsProps,
  hero,
  links: linksFromProps,
}) => {
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Page['hero']['theme']>(hero?.theme)

  const hasBackground = () => {
    if (hero) {
      switch (hero.type) {
        case 'gradient':
          return Boolean(hero.fullBackground)
        case 'home':
          return true
        case 'three':
          return true
        default:
          return false
      }
    } else {
      return false
    }
  }

  const links = hero?.breadcrumbsBarLinks ?? linksFromProps
  const enableBreadcrumbsBar = linksFromProps ?? hero?.enableBreadcrumbsBar

  useEffect(() => {
    if (hero?.theme) {
      setThemeState(hero.theme)
    } else if (themeFromContext) {
      setThemeState(themeFromContext)
    }
  }, [themeFromContext, hero])

  const breadcrumbs = useMemo(() => {
    return breadcrumbsProps ?? []
  }, [breadcrumbsProps])

  const useTheme = hasBackground() ? 'dark' : (themeState ?? 'dark')

  return (
    <ChangeHeaderTheme theme={useTheme}>
      <div
        className={[classes.wrapper, !hasBackground() && classes.hasBackground]
          .filter(Boolean)
          .join(' ')}
        {...(useTheme ? { 'data-theme': useTheme } : {})}
      >
        <Gutter>
          {enableBreadcrumbsBar ? (
            <>
              <div className={classes.container}>
                <div>{breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}</div>

                <div className={classes.links}>
                  {Array.isArray(links) &&
                    links.map((linkItem, i) => {
                      const link = 'link' in linkItem ? linkItem.link : linkItem
                      const newTab = link?.newTab

                      return (
                        <CMSLink
                          className={classes.link}
                          key={i}
                          {...link}
                          appearance={'text'}
                          buttonProps={{
                            icon: newTab ? 'arrow' : undefined,
                            labelStyle: 'regular',
                          }}
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
                    {Array.isArray(links) &&
                      links.map((linkItem, i) => {
                        const link = 'link' in linkItem ? linkItem.link : linkItem
                        const newTab = link?.newTab

                        return (
                          <CMSLink
                            className={classes.link}
                            key={i}
                            {...link}
                            appearance={'text'}
                            buttonProps={{
                              icon: newTab ? 'arrow' : undefined,
                              labelStyle: 'regular',
                            }}
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
