import type { Metadata } from 'next'

import { LinkGrid } from '@blocks/LinkGrid/index'
import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchTeams } from '@cloud/_api/fetchTeam'
import { TeamDrawer, TeamDrawerToggler } from '@cloud/_components/TeamDrawer/index'
import { cloudSlug } from '@cloud/slug'
import { Gutter } from '@components/Gutter/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React from 'react'

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
        <Gutter className={classes.introContent}>
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
        </Gutter>
        {hasTeams && (
          <LinkGrid
            blockType="linkGrid"
            className={classes.linkGrid}
            linkGridFields={{
              links:
                teams?.map((team, index) => {
                  if (!team || typeof team === 'string') {
                    return null as any
                  }

                  return {
                    link: {
                      type: 'custom',
                      label: team.name,
                      url: `/${cloudSlug}/${team.slug}`,
                    },
                  }
                }) || [],
            }}
          />
        )}
      </div>
      <TeamDrawer drawerSlug={drawerSlug} redirectOnCreate />
    </React.Fragment>
  )
}

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: `My Teams`,
    url: `/cloud/teams`,
  }),
  title: `My Teams`,
}
