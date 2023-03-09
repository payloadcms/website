'use client'

import { Fragment } from 'react'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'
import { RouteTabs } from './_components/RouteTabs'
import { RouteDataProvider, useRouteData } from './context'

export const cloudSlug = 'cloud'

const DashboardHeader = () => {
  const { team, project } = useRouteData()
  const segments = usePathnameSegments()

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

  return (
    <Fragment>
      <Gutter>
        <Breadcrumbs
          items={segments.reduce((acc: Breadcrumb[], segment) => {
            acc.push({
              label:
                segment === 'cloud'
                  ? 'Cloud'
                  : routes[segment]?.crumbLabel || routes[segment]?.tabLabel,
              url: `/${cloudSlug}${routes[segment]?.href || ''}`,
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
              acc.push({
                label: value.tabLabel,
                url: `/${cloudSlug}${value.href || ''}`,
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

  return (
    <RouteDataProvider>
      <DashboardHeader />
      {children}
    </RouteDataProvider>
  )
}

export default DashboardLayout
