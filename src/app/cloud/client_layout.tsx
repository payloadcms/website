'use client'

import { Fragment } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { Message } from '@components/Message'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'
import { Tabs } from './_components/Tabs'
import { RouteDataProvider, useRouteData } from './context'

export const cloudSlug = 'cloud'

const DashboardHeader = () => {
  const searchParams = useSearchParams()
  const { team, project } = useRouteData()
  const pathname = usePathname()
  let segments = usePathnameSegments()

  const successParam = searchParams?.get('success')
  const errorParam = searchParams?.get('error')
  const warningParam = searchParams?.get('warning')
  let renderTabs = true

  // optional `tabLabel` and `crumbLabel` properties determine
  // where whether the item is rendered in the breadcrumbs or tabs, or both
  let routes: {
    [key: string]: {
      tabLabel?: string
      crumbLabel?: string
      href?: string
    }
  } = {
    [cloudSlug]: {
      tabLabel: 'Projects',
    },
    teams: {
      tabLabel: 'Teams',
      href: '/teams',
    },
    settings: {
      tabLabel: 'Settings',
      href: '/settings',
    },
  }

  const isTeamRoute = team?.slug && segments?.[1] && segments[1] === team.slug
  const isProjectRoute = isTeamRoute && project?.slug && segments?.[2] === project.slug
  let isSettingsRoute = false
  let maxCrumbs = 3

  if (isTeamRoute) {
    routes = {
      [`${team?.slug}`]: {
        tabLabel: 'Projects',
        crumbLabel: team?.slug,
        href: `/${team?.slug}`,
      },
      settings: {
        tabLabel: 'Settings',
        href: `/${team?.slug}/settings`,
      },
    }

    isSettingsRoute = segments[2] === 'settings'
  }

  if (isProjectRoute) {
    routes = {
      [`${team?.slug}`]: {
        crumbLabel: team?.slug,
        href: `/${team?.slug}`,
      },
      [`${project?.slug}`]: {
        tabLabel: 'Overview',
        crumbLabel: project?.slug,
        href: `/${team?.slug}/${project?.slug}`,
      },
      database: {
        tabLabel: 'Database',
        href: `/${team?.slug}/${project?.slug}/database`,
      },
      'file-storage': {
        tabLabel: 'File Storage',
        href: `/${team?.slug}/${project?.slug}/file-storage`,
      },
      logs: {
        tabLabel: 'Logs',
        href: `/${team?.slug}/${project?.slug}/logs`,
      },
      settings: {
        tabLabel: 'Settings',
        href: `/${team?.slug}/${project?.slug}/settings`,
      },
    }

    isSettingsRoute = segments[3] === 'settings'
    maxCrumbs = 4

    if (pathname === `/${cloudSlug}/${team?.slug}/${project?.slug}/configure`) {
      maxCrumbs = 3
      renderTabs = false
    }
  }

  const failedToDeployApp =
    project?.infraStatus && !['notStarted', 'awaitingDatabase'].includes(project.infraStatus)

  return (
    <Fragment>
      <Gutter>
        <Message error={errorParam} success={successParam} warning={warningParam} />
        <Breadcrumbs
          items={segments.reduce((acc: Breadcrumb[], segment, index) => {
            const lowercaseSegment = segment.toLowerCase()

            if (index + 1 <= maxCrumbs) {
              acc.push({
                label:
                  lowercaseSegment === 'cloud'
                    ? 'Cloud'
                    : routes[lowercaseSegment]?.crumbLabel || routes[lowercaseSegment]?.tabLabel,
                url: `/${cloudSlug}${routes[lowercaseSegment]?.href || ''}`,
              })
            }

            return acc
          }, [])}
        />
      </Gutter>
      {renderTabs && (
        <Tabs
          tabs={[
            ...Object.entries(routes).reduce((acc: any[], [, value]) => {
              if (value.tabLabel) {
                const tabURL = `/${cloudSlug}${value.href || ''}`
                const onTabPath = pathname === tabURL
                const onSettingsPath = isSettingsRoute && tabURL?.includes('/settings')
                const isActive = onTabPath || onSettingsPath

                const tab = {
                  label: value.tabLabel,
                  url: tabURL,
                  isActive,
                }

                if (isProjectRoute) {
                  if (project?.infraStatus === 'done') {
                    // push all tabs for online projects
                    acc.push(tab)
                  } else {
                    // always push the overview tab for offline projects
                    if (tab.label === 'Overview') {
                      acc.push(tab)
                    }

                    // push the settings tab for offline projects that made it to DigitalOcean
                    // (i.e. db creation was successful, but the app failed to deploy, or is deploying)
                    if (failedToDeployApp && tab.label === 'Settings') {
                      acc.push(tab)
                    }
                  }
                } else {
                  acc.push(tab)
                }
              }

              return acc
            }, []),
          ]}
        />
      )}
    </Fragment>
  )
}

export const CloudLayout = ({ children }) => {
  useAuthRedirect()

  return (
    <RouteDataProvider>
      <DashboardHeader />
      {children}
    </RouteDataProvider>
  )
}
