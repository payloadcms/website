import React from 'react'
import { LinkGrid } from '@blocks/LinkGrid'
import { Metadata } from 'next'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { fetchMe } from '@root/app/(cloud)/cloud/_api/fetchMe'
import { fetchTeams } from '@root/app/(cloud)/cloud/_api/fetchTeam'
import { TeamDrawer, TeamDrawerToggler } from '@root/app/(cloud)/cloud/_components/TeamDrawer'
import { cloudSlug } from '@root/app/(cloud)/cloud/slug'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'

import classes from './page.module.scss'

const drawerSlug = 'team-drawer'

export default async () => {
  const { user } = await fetchMe()

  const teams = await fetchTeams(
    user?.teams?.map(({ team }) => (team && typeof team === 'object' ? team.id : team || '')) || [],
  )

  const hasTeams = Boolean(teams?.length && teams.length > 0)

  return (
    <React.Fragment>
      <div className={classes.teams}>
        <Gutter>
          <div className={classes.introContent}>
            {!hasTeams && (
              <p>
                {`You are not a member of any teams. `}
                <TeamDrawerToggler className={classes.createTeamLink} drawerSlug={drawerSlug}>
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
                <TeamDrawerToggler className={classes.createTeamLink} drawerSlug={drawerSlug}>
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
          <TeamDrawerToggler className={classes.teamDrawerToggler} drawerSlug={drawerSlug}>
            <Button appearance="primary" label="Create new team" el="div" />
          </TeamDrawerToggler>
        </Gutter>
      </div>
      <TeamDrawer drawerSlug={drawerSlug} redirectOnCreate />
    </React.Fragment>
  )
}

export const metadata: Metadata = {
  title: `My Teams`,
  openGraph: mergeOpenGraph({
    title: `My Teams`,
    url: `/cloud/teams`,
  }),
}
