'use client'

import { cloudSlug } from '@cloud/slug'
import { usePathname } from 'next/navigation'

import { usePathnameSegments } from '@root/utilities/use-pathname-segments'
import { Breadcrumb, Breadcrumbs } from '../../../../components/Breadcrumbs'

export type Routes = {
  [key: string]: Breadcrumb
}

const baseRoutes: Routes = {
  cloud: {
    label: 'Cloud',
    url: `/${cloudSlug}`,
  },
  teams: {
    label: 'Teams',
    url: `/${cloudSlug}/teams`,
  },
  settings: {
    label: 'Settings',
    url: `/${cloudSlug}/settings`,
  },
}

export const DashboardBreadcrumbs = () => {
  const pathname = usePathname()
  let segments = usePathnameSegments()

  let isSettingsRoute = false
  let maxCrumbs = 3

  let routes: Routes = baseRoutes

  const isTeamRoute = segments?.[1] && !routes.hasOwnProperty(segments[1])

  if (isTeamRoute) {
    const teamSlug = segments?.[1]

    routes = {
      [cloudSlug]: {
        label: 'Cloud',
        url: `/${cloudSlug}`,
      },
      [teamSlug]: {
        label: teamSlug,
        url: `/${cloudSlug}/${teamSlug}`,
      },
      settings: {
        label: 'Settings',
        url: `/${cloudSlug}/${teamSlug}/settings`,
      },
    }

    isSettingsRoute = segments[2] === 'settings'
  }

  const isProjectRoute = segments?.[2] && !routes.hasOwnProperty(segments[2])

  if (isProjectRoute) {
    const teamSlug = segments?.[1]
    const projectSlug = segments?.[2]

    routes = {
      [cloudSlug]: {
        label: 'Cloud',
        url: `/${cloudSlug}`,
      },
      [teamSlug]: {
        label: teamSlug,
        url: `/${cloudSlug}/${teamSlug}`,
      },
      [projectSlug]: {
        label: projectSlug,
        url: `/${cloudSlug}/${teamSlug}/${projectSlug}`,
      },
      database: {
        label: 'Database',
        url: `/${cloudSlug}/${teamSlug}/${projectSlug}/database`,
      },
      'file-storage': {
        label: 'Storage',
        url: `/${cloudSlug}/${teamSlug}/${projectSlug}/file-storage`,
      },
      logs: {
        label: 'Logs',
        url: `/${cloudSlug}/${teamSlug}/${projectSlug}/logs`,
      },
      settings: {
        label: 'Settings',
        url: `/${cloudSlug}/${teamSlug}/${projectSlug}/settings`,
      },
    }

    isSettingsRoute = segments[3] === 'settings'
    maxCrumbs = 4

    if (pathname === `/${cloudSlug}/${teamSlug}/${projectSlug}/configure`) {
      maxCrumbs = 3
    }
  }

  return (
    <Breadcrumbs
      items={segments.reduce((acc: Breadcrumb[], segment, index) => {
        const lowercaseSegment = segment.toLowerCase()

        if (index + 1 <= maxCrumbs) {
          acc.push(routes[lowercaseSegment])
        }

        return acc
      }, [])}
    />
  )
}
