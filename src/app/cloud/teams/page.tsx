'use client'

import * as React from 'react'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { LineDraw } from '@components/LineDraw'
import { useTeamDrawer } from '@components/TeamDrawer'
import { useAuth } from '@root/providers/Auth'
import { cloudSlug } from '../layout'

import classes from './page.module.scss'

export default () => {
  const { user } = useAuth()
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer()

  const hasTeams = user?.teams?.length && user.teams.length > 0

  return (
    <React.Fragment>
      <div className={classes.teams}>
        <Gutter className={classes.content}>
          {hasTeams && (
            <ul className={classes.list}>
              {user.teams.map(({ team }, index) => {
                if (typeof team === 'string') return null
                const isHovered = hoverIndex === index

                return (
                  <li key={team.id} className={classes.listItem}>
                    <Link
                      href={`/${cloudSlug}/${team.slug}`}
                      className={classes.team}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <div className={classes.teamWrapper}>
                        <div className={classes.teamContent}>
                          {team?.name && <p className={classes.teamName}>{team.name}</p>}
                          {team?.slug && <p className={classes.teamSlug}>{team.slug}</p>}
                        </div>
                        <Button
                          size="small"
                          appearance="primary"
                          label="View"
                          href={`/${cloudSlug}/${team.slug}`}
                        />
                      </div>
                      <LineDraw active={isHovered} align="bottom" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
          <TeamDrawerToggler className={classes.teamDrawerToggler}>
            <Button appearance="secondary" label="Create new team" el="div" />
          </TeamDrawerToggler>
        </Gutter>
      </div>
      <TeamDrawer />
    </React.Fragment>
  )
}
