import type { Metadata } from 'next'

import { LinkGrid } from '@blocks/LinkGrid/index'
import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchTeams } from '@cloud/_api/fetchTeam'
import { cloudSlug } from '@cloud/slug'
import { Banner } from '@components/Banner'
import { Gutter } from '@components/Gutter/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import Link from 'next/link'
import React from 'react'

import classes from './page.module.scss'

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
          <Banner type="warning">
            <p>
              Creating new teams is currently not available. To make changes to your existing team,
              please contact{' '}
              <Link href={'mailto:support@payloadcms.com'}>support@payloadcms.com</Link>
            </p>
          </Banner>
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
