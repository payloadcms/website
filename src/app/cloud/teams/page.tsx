'use client'

import * as React from 'react'
import Link from 'next/link'

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
          {hasTeams && (
            <ul className={classes.list}>
              {user?.teams?.map(({ team }, index) => {
                if (!team || typeof team === 'string') return null

                return (
                  <li key={`${team.id}-${index}`} className={classes.listItem}>
                    <Link href={`/${cloudSlug}/${team.slug}`} className={classes.team}>
                      <div className={classes.teamContent}>
                        {team?.name && <p className={classes.teamName}>{team.name}</p>}
                        {team?.slug && <p className={classes.teamSlug}>{team.slug}</p>}
                      </div>
                      <Button
                        size="small"
                        appearance="secondary"
                        label="View"
                        href={`/${cloudSlug}/${team.slug}`}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
          <TeamDrawerToggler className={classes.teamDrawerToggler}>
            <Button appearance="primary" label="Create new team" el="div" />
          </TeamDrawerToggler>
        </Gutter>
      </div>
      <TeamDrawer redirectAfterCreate />
    </React.Fragment>
  )
}
