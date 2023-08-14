'use client'

import { cloudSlug } from '@cloud/slug'
import { usePathname } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'

export type Routes = {
  [key: string]: {
    label?: string
    href?: string
  }
}

const baseRoutes: Routes = {
  [cloudSlug]: {},
  teams: {
    href: '/teams',
  },
  settings: {
    href: '/settings',
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
    routes = {
      [segments?.[1]]: {
        label: segments?.[1],
        href: `/${segments?.[1]}`,
      },
      settings: {
        href: `/${segments?.[1]}/settings`,
      },
    }

    isSettingsRoute = segments[2] === 'settings'
  }

  const isProjectRoute = segments?.[2] && !routes.hasOwnProperty(segments[2])

  if (isProjectRoute) {
    const teamSlug = segments?.[1]
    const projectSlug = segments?.[2]

    routes = {
      [teamSlug]: {
        label: teamSlug,
        href: `/${teamSlug}`,
      },
      [projectSlug]: {
        label: projectSlug,
        href: `/${teamSlug}/${projectSlug}`,
      },
      database: {
        href: `/${teamSlug}/${projectSlug}/database`,
      },
      'file-storage': {
        label: 'Storage',
        href: `/${teamSlug}/${projectSlug}/file-storage`,
      },
      logs: {
        href: `/${teamSlug}/${projectSlug}/logs`,
      },
      settings: {
        label: 'Settings',
        href: `/${teamSlug}/${projectSlug}/settings`,
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
          acc.push({
            label: lowercaseSegment === 'cloud' ? 'Cloud' : routes[lowercaseSegment]?.label,
            url: `/${cloudSlug}${routes[lowercaseSegment]?.href || ''}`,
          })
        }

        return acc
      }, [])}
    />
  )
}
