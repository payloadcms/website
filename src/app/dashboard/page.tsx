'use client'

import React, { Fragment } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { LineDraw } from '@components/LineDraw'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { TeamSelector } from '@components/TeamSelector'
import { Project, Team } from '@root/payload-cloud-types'
import useDebounce from '@root/utilities/use-debounce'

import classes from './index.module.scss'

export default () => {
  const [selectedTeam, setSelectedTeam] = React.useState<Team>()
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [projects, setProjects] = React.useState<Project[] | null>()
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    setIsLoading(true)

    try {
      const fetchProjects = async () => {
        const projReq = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects?where[team][equals]=${selectedTeam.id}`,
          {
            credentials: 'include',
          },
        )

        const projRes = await projReq.json()

        if (projReq.ok) {
          setProjects(projRes.docs)
          setIsLoading(false)
        } else {
          setError(projRes.message)
          setIsLoading(false)
        }
      }

      fetchProjects()
    } catch (err) {
      setError(err.message)
    }
  }, [selectedTeam])

  const loading = useDebounce(isLoading, 250)

  return (
    <Gutter>
      <div className={classes.header}>
        <h1 className={classes.title}>Projects</h1>
        {/* <Button appearance="primary" href="/new" label="Create new project" el="link" /> */}
      </div>
      {error && <p className={classes.error}>{error}</p>}
      <Grid>
        <Cell cols={3} colsM={8}>
          <TeamSelector onChange={setSelectedTeam} />
          <br />
          <Link href="/logout">Logout</Link>
        </Cell>
        <Cell cols={9} colsM={8}>
          {loading && <LoadingShimmer number={3} />}
          {!loading && (
            <Fragment>
              {projects && projects.length === 0 && (
                <p className={classes.noProjects}>
                  {"You don't have any projects yet, "}
                  <Link href="/new">create a new project</Link>
                  {' to get started.'}
                </p>
              )}
              {Array.isArray(projects) && projects.length > 0 && (
                <div className={classes.projects}>
                  {projects.map((project, index) => {
                    const { team, _status } = project

                    const teamSlug = typeof team === 'string' ? team : team.slug
                    const isHovered = hoverIndex === index

                    return (
                      <div
                        key={project.id}
                        className={classes.project}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                      >
                        <h6 className={classes.projectTitle}>
                          {project.name}
                          {_status === 'draft' && (
                            <span className={classes.draft}>&nbsp;(Draft)</span>
                          )}
                        </h6>
                        <Button
                          appearance="primary"
                          label={_status === 'draft' ? 'Configure' : 'Open'}
                          size="small"
                          href={
                            _status === 'draft'
                              ? `/new/configure/${project.id}`
                              : `/dashboard/${teamSlug}/${project.slug}`
                          }
                          el="link"
                        />
                        <LineDraw align="bottom" active={isHovered} />
                      </div>
                    )
                  })}
                </div>
              )}
            </Fragment>
          )}
        </Cell>
      </Grid>
    </Gutter>
  )
}
