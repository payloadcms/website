'use client'

import * as React from 'react'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { LineDraw } from '@components/LineDraw'
import { useAuth } from '@root/providers/Auth'
import { RouteTabs } from '../_components/RouteTabs'

import classes from './page.module.scss'

export default () => {
  const { user } = useAuth()
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)

  const hasTeams = user?.teams?.length > 0

  return (
    <div className={classes.teams}>
      <RouteTabs
        basePath="/dashboard"
        tabs={[
          {
            label: 'Projects',
          },
          {
            label: 'Teams',
            slug: 'teams',
          },
          {
            label: 'Settings',
            slug: 'settings',
          },
        ]}
      />
      <Gutter>
        {hasTeams && (
          <ul className={classes.list}>
            {user.teams.map(({ team }, index) => {
              if (typeof team === 'string') return null
              const isHovered = hoverIndex === index

              return (
                <li key={team.id} className={classes.listItem}>
                  <Link
                    href={`/dashboard/${team.slug}`}
                    className={classes.team}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className={classes.teamContent}>
                      <p className={classes.teamName}>{team.name}</p>
                      <Button
                        size="small"
                        appearance="primary"
                        label="View"
                        href={`/dashboard/${team.slug}`}
                      />
                    </div>
                    <LineDraw active={isHovered} align="bottom" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </Gutter>
    </div>
  )
}
