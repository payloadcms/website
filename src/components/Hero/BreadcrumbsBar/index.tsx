'use client'
import React, { useEffect, useMemo, useState } from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { ChevronIcon } from '@root/icons/ChevronIcon'
import { Page } from '@root/payload-types'
import { useThemePreference } from '@root/providers/Theme'

import classes from './index.module.scss'

interface HeroProps {
  hero: Page['hero']
  links?: never
}

interface LinksProps {
  hero?: never
  links: {
    url: string
    label: string
    newTab?: boolean
    icon?: 'arrow'
  }[]
}

type Conditional = HeroProps | LinksProps

type Props = {
  breadcrumbs: Page['breadcrumbs']
} & Conditional

const BreadcrumbsBar: React.FC<Props> = ({
  hero,
  breadcrumbs: breadcrumbsProps,
  links: linksFromProps,
}) => {
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Page['hero']['theme']>(hero?.theme)

  const hasBackground = () => {
    if (hero) {
      switch (hero.type) {
        case 'home':
          return true
        case 'gradient':
          return Boolean(hero.fullBackground)
        default:
          return false
      }
    } else {
      return false
    }
  }

  const links = hero?.breadcrumbsBarLinks ?? linksFromProps
  const enableBreadcrumbsBar = linksFromProps ?? hero.enableBreadcrumbsBar

  useEffect(() => {
    if (hero?.theme) setThemeState(hero.theme)
    else if (themeFromContext) setThemeState(themeFromContext)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeFromContext, hero])

  const breadcrumbs = useMemo(() => {
    return breadcrumbsProps ?? []
  }, [breadcrumbsProps])

  const useTheme = hasBackground() ? 'dark' : themeState ?? 'dark'

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

                      return (
                        <CMSLink
                          className={classes.link}
                          key={i}
                          {...link}
                          appearance={'text'}
                          buttonProps={{
                            icon: linkItem.link.newTab && 'arrow',
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

                        return (
                          <CMSLink
                            className={classes.link}
                            key={i}
                            {...link}
                            appearance={'text'}
                            buttonProps={{
                              icon: linkItem.link.newTab && 'arrow',
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
