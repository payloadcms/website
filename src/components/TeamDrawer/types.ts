import type { HTMLAttributes } from 'react'
import type React from 'react'

import type { Team } from '@root/payload-cloud-types'

export interface TeamDrawerProps {
  drawerSlug: string
  team?: Team
  onCreate?: (team: Team) => void
  closeDrawer: () => void
  redirectAfterCreate?: boolean
}

export type TeamDrawerTogglerProps = HTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  className?: string
  drawerSlug: string
  disabled?: boolean
}

export type UseTeamDrawer = (args?: { team?: Team }) => [
  React.FC<Pick<TeamDrawerProps, 'onCreate' | 'redirectAfterCreate'>>, // drawer
  React.FC<Pick<TeamDrawerTogglerProps, 'disabled' | 'className' | 'children'>>, // toggler
  {
    drawerSlug: string
    isDrawerOpen: boolean
    toggleDrawer: () => void
    closeDrawer: () => void
    openDrawer: () => void
  },
]
