'use client'

import * as React from 'react'
import { LinkGrid } from '@blocks/LinkGrid'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { useTeamDrawer } from '@components/TeamDrawer'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { cloudSlug } from '../_components/DashboardHeader'

import classes from './page.module.scss'

export const TeamsPage: React.FC<{
  teams: Team[]
}> = props => {
  const { teams } = props

  const router = useRouter()

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer()

  const hasTeams = Boolean(teams?.length && teams.length > 0)

  return (
    <React.Fragment>
      <div className={classes.teams}>
        <Gutter>
          <div className={classes.introContent}>
            {!hasTeams && (
              <p>
                {`You are not a member of any teams. `}
                <TeamDrawerToggler className={classes.createTeamLink}>
                  Create a new team
                </TeamDrawerToggler>
                {' to get started.'}
              </p>
            )}
            {Boolean(teams?.length) && (
              <p>
                {`You are a member of ${teams?.length || 0} team${
                  (teams?.length || 0) > 1 ? 's' : ''
                }. `}
                <TeamDrawerToggler className={classes.createTeamLink}>
                  Create a new team
                </TeamDrawerToggler>
                {'.'}
              </p>
            )}
          </div>
        </Gutter>
        {hasTeams && (
          <LinkGrid
            blockType="linkGrid"
            className={classes.linkGrid}
            topMargin={false}
            bottomMargin={false}
            linkGridFields={{
              links:
                teams?.map((team, index) => {
                  if (!team || typeof team === 'string') return null as any

                  return {
                    link: {
                      type: 'custom',
                      url: `/${cloudSlug}/${team.slug}`,
                      label: team.name,
                    },
                  }
                }) || [],
            }}
          />
        )}
        <Gutter>
          <TeamDrawerToggler className={classes.teamDrawerToggler}>
            <Button appearance="primary" label="Create new team" el="div" />
          </TeamDrawerToggler>
        </Gutter>
      </div>
      <TeamDrawer
        onCreate={newTeam => {
          router.push(`/${cloudSlug}/${newTeam.slug}`)
        }}
      />
    </React.Fragment>
  )
}
