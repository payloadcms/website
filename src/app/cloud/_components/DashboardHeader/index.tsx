'use client'

import { Fragment } from 'react'
import { usePathname } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'
import { ProjectStatusMessage } from '../../../_components/ProjectStatusMessage'
import { RenderParams } from '../../../_components/RenderParams'
import { Tabs } from '../Tabs'

export const cloudSlug = 'cloud'

export type Routes = {
  [key: string]: {
    tabLabel?: string
    crumbLabel?: string
    href?: string
  }
}

const baseRoutes: Routes = {
  [cloudSlug]: {
    tabLabel: 'All Projects',
  },
  teams: {
    tabLabel: 'Teams',
    href: '/teams',
  },
  settings: {
    tabLabel: 'Account',
    href: '/settings',
  },
}

export const DashboardHeader = () => {
  const pathname = usePathname()
  let segments = usePathnameSegments()

  let renderTabs = true

  let isSettingsRoute = false
  let maxCrumbs = 3

  let routes: Routes = baseRoutes

  const isTeamRoute = segments?.[1] && !routes.hasOwnProperty(segments[1])

  if (isTeamRoute) {
    routes = {
      [segments?.[1]]: {
        tabLabel: 'Team Projects',
        crumbLabel: segments?.[1],
        href: `/${segments?.[1]}`,
      },
      settings: {
        tabLabel: 'Team Settings',
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
        crumbLabel: teamSlug,
        href: `/${teamSlug}`,
      },
      [projectSlug]: {
        tabLabel: 'Overview',
        crumbLabel: projectSlug,
        href: `/${teamSlug}/${projectSlug}`,
      },
      database: {
        tabLabel: 'Database',
        href: `/${teamSlug}/${projectSlug}/database`,
      },
      'file-storage': {
        tabLabel: 'File Storage',
        crumbLabel: 'Storage',
        href: `/${teamSlug}/${projectSlug}/file-storage`,
      },
      logs: {
        tabLabel: 'Logs',
        href: `/${teamSlug}/${projectSlug}/logs`,
      },
      settings: {
        tabLabel: 'Project Settings',
        crumbLabel: 'Settings',
        href: `/${teamSlug}/${projectSlug}/settings`,
      },
    }

    isSettingsRoute = segments[3] === 'settings'
    maxCrumbs = 4

    if (pathname === `/${cloudSlug}/${teamSlug}/${projectSlug}/configure`) {
      maxCrumbs = 3
      renderTabs = false
    }
  }

  return (
    <Fragment>
      <Gutter>
        <RenderParams />
        {/* {isProjectRoute && <ProjectStatusMessage project={project} />} */}
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

                acc.push(tab)
              }

              return acc
            }, []),
          ]}
        />
      )}
    </Fragment>
  )
}
