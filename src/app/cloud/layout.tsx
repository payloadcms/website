'use client'

import { Fragment } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { Message } from '@components/Message'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'
import { RouteTabs } from './_components/RouteTabs'
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

  // we know it's a team route if the second segment is not a base route
  // i.e. /cloud/teams is a team route, /cloud/settings is not
  // we can do the same for project routes one level deeper
  const isTeamRoute = segments.length > 1 && routes[segments[1]] === undefined

  if (isTeamRoute) {
    routes = {
      [`${team?.slug}`]: {
        tabLabel: 'Projects',
        crumbLabel: team?.slug,
        href: `/${team?.slug}`,
      },
      billing: {
        tabLabel: 'Billing',
        href: `/${team?.slug}/billing`,
      },
      settings: {
        tabLabel: 'Settings',
        href: `/${team?.slug}/settings`,
      },
    }
  }

  const isProjectRoute = isTeamRoute && segments.length > 2 && routes[segments[2]] === undefined

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
  }

  const isSettingsRoute = segments.length >= 3 && segments[3] === 'settings'

  if (isSettingsRoute) {
    segments = segments.slice(0, 4)
  }

  const failedToDeployApp =
    project?.infraStatus &&
    ['appCreationError', 'deployError', 'error'].includes(project.infraStatus)

  return (
    <Fragment>
      <Gutter>
        <Message error={errorParam} success={successParam} warning={warningParam} />
        <Breadcrumbs
          items={segments.reduce((acc: Breadcrumb[], segment) => {
            const lowercaseSegment = segment.toLowerCase()
            acc.push({
              label:
                lowercaseSegment === 'cloud'
                  ? 'Cloud'
                  : routes[lowercaseSegment]?.crumbLabel || routes[lowercaseSegment]?.tabLabel,
              url: `/${cloudSlug}${routes[lowercaseSegment]?.href || ''}`,
            })
            return acc
          }, [])}
        />
      </Gutter>
      <RouteTabs
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
    </Fragment>
  )
}

const DashboardLayout = ({ children }) => {
  useAuthRedirect()

  return (
    <RouteDataProvider>
      <DashboardHeader />
      {children}
    </RouteDataProvider>
  )
}

export default DashboardLayout
