'use client'

import { Fragment } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { useAuth } from '@root/providers/Auth'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'
import { RouteTabs } from './_components/RouteTabs'
import { RouteDataProvider, useRouteData } from './context'
import Dashboard from './Dashboard'

export const cloudSlug = 'cloud'

const DashboardHeader = () => {
  const searchParams = useSearchParams()
  const { team, project } = useRouteData()
  const pathname = usePathname()
  let segments = usePathnameSegments()

  const message = searchParams?.get('message')

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

  return (
    <Fragment>
      <Gutter>
        {message && <p>{message}</p>}
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
          // eslint-disable-next-line no-unused-vars
          ...Object.entries(routes).reduce((acc: any[], [key, value]) => {
            if (value.tabLabel) {
              const tabURL = `/${cloudSlug}${value.href || ''}`
              const onTabPath = pathname === tabURL
              const onSettingsPath = isSettingsRoute && tabURL?.includes('/settings')
              const isActive = onTabPath || onSettingsPath

              acc.push({
                label: value.tabLabel,
                url: tabURL,
                isActive,
              })
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
  const { user } = useAuth()
  const pathname = usePathname()

  if (pathname === '/cloud') {
    // render the generic cloud landing page if the user is not logged in
    if (!user) return children

    return (
      <RouteDataProvider>
        <DashboardHeader />
        <Dashboard />
      </RouteDataProvider>
    )
  }

  return (
    <RouteDataProvider>
      <DashboardHeader />
      {children}
    </RouteDataProvider>
  )
}

export default DashboardLayout
