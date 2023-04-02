'use client'

import * as React from 'react'
import { LinkGrid } from '@blocks/LinkGrid'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { useTeamDrawer } from '@components/TeamDrawer'
import { useAuth } from '@root/providers/Auth'
import { cloudSlug } from '../layout'

import classes from './page.module.scss'

export default () => {
  const { user } = useAuth()

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer()

  const hasTeams = Boolean(user?.teams?.length && user.teams.length > 0)

  return (
    <React.Fragment>
      <div className={classes.teams}>
        <Gutter className={classes.content}>
          {!hasTeams && (
            <div className={classes.noTeams}>
              <p>
                {`You are not a member of any teams. `}
                <TeamDrawerToggler className={classes.createTeamLink}>
                  Create a new team
                </TeamDrawerToggler>
                {' to get started.'}
              </p>{' '}
            </div>
          )}
          {user?.teams?.length && (
            <p>
              {`You are a member of ${user.teams?.length} team${
                user.teams.length > 1 ? 's' : ''
              }. `}
              <TeamDrawerToggler className={classes.createTeamLink}>
                Create a new team
              </TeamDrawerToggler>
              {'.'}
            </p>
          )}
        </Gutter>
        {hasTeams && (
          <LinkGrid
            blockType="linkGrid"
            className={classes.linkGrid}
            topMargin={false}
            bottomMargin={false}
            linkGridFields={{
              links:
                user?.teams?.map(({ team }, index) => {
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
      <TeamDrawer redirectAfterCreate />
    </React.Fragment>
  )
}
