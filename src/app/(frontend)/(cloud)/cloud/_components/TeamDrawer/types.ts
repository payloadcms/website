import type { Team } from '@root/payload-cloud-types'
import type { HTMLAttributes } from 'react'
import type React from 'react'

export interface TeamDrawerProps {
  drawerSlug: string
  onCreate?: (team: Team, closeDrawer: () => void) => Promise<void> | void
  redirectOnCreate?: boolean
  team?: Team
}

export type TeamDrawerTogglerProps = {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  drawerSlug: string
} & HTMLAttributes<HTMLButtonElement>

export type UseTeamDrawer = (args?: { team?: Team }) => [
  React.FC<Pick<TeamDrawerProps, 'onCreate'>>, // drawer
  React.FC<Pick<TeamDrawerTogglerProps, 'children' | 'className' | 'disabled'>>, // toggler
  {
    drawerSlug: string
    isDrawerOpen: boolean
    openDrawer: () => void
    toggleDrawer: () => void
  },
]
