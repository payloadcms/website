'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { Label } from '@components/Label'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { Indicator } from '@root/app/_components/Indicator'
import { BranchIcon } from '@root/graphics/BranchIcon'
import { CommitIcon } from '@root/graphics/CommitIcon'
import { Deployment } from '@root/payload-cloud-types'
import { formatDate } from '@root/utilities/format-date-time'
import { qs } from '@root/utilities/qs'
import { useGetProjectDeployments } from '@root/utilities/use-cloud-api'
import { useWebSocket } from '@root/utilities/use-websocket'

import classes from './index.module.scss'

export const InfraOnline: React.FC = () => {
  const [logsWebSocketURL, setLogsWebSocketURL] = React.useState<string>('')
  const { project } = useRouteData()

  const {
    isLoading,
    error,
    result: deployments,
  } = useGetProjectDeployments({
    projectID: project.id,
    interval: 10_000,
  })

  const [message, , wsError] = useWebSocket(logsWebSocketURL)

  React.useEffect(() => {
    async function getSocketURL() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}/run-logs`,
        {
          method: 'GET',
          credentials: 'include',
        },
      )

      const json = await res.json()
      // console.log(json)
      const logsText = await fetch(json.live_url).then(res => res.text())
      console.log(logsText)
      // setLogsWebSocketURL(json.live_url)
    }

    getSocketURL()
  }, [project.id])

  const [activeDeployment, setActiveDeployment] = React.useState<Deployment | null | undefined>(
    deployments?.find(deployment => {
      return deployment.deploymentStatus === 'ACTIVE'
    }),
  )

  React.useEffect(() => {
    const getActiveDeployment = async () => {
      if (!activeDeployment) {
        const query = qs.stringify({
          where: {
            and: [
              {
                project: {
                  equals: project.id,
                },
              },
              {
                deploymentStatus: {
                  equals: 'ACTIVE',
                },
              },
            ],
          },
        })

        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deployments?${query}&limit=1`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const json = await req.json()

        if (json.docs?.[0]) {
          setActiveDeployment(json.docs[0])
        } else {
          setActiveDeployment(null)
        }
      }
    }

    getActiveDeployment()
  }, [activeDeployment, project.id])

  const projectDomains = [
    ...(project?.domains || []).map(domain => domain.domain),
    project.defaultDomain,
  ]

  return (
    <React.Fragment>
      <ExtendedBackground
        pixels
        upperChildren={
          <Grid>
            <Cell start={1} cols={4} colsM={8}>
              <Label>Visit CMS</Label>
              <ul>
                {projectDomains.map(domain => (
                  <li key={domain} title={domain}>
                    <a
                      className={[classes.detail, classes.domainLink].filter(Boolean).join(' ')}
                      href={`https://${domain}`}
                      target="_blank"
                    >
                      {domain}
                    </a>
                  </li>
                ))}
              </ul>
            </Cell>

            <Cell start={5} cols={3} startM={1} colsM={8}>
              <Label>Deployment Created At</Label>
              <p className={classes.detail}>
                {activeDeployment
                  ? formatDate({ date: activeDeployment.createdAt, format: 'dateAndTime' })
                  : ''}
              </p>
            </Cell>

            <Cell start={9} cols={4} startM={1} colsM={8}>
              <Label>Status</Label>
              <div className={classes.statusDetail}>
                <Indicator
                  status={
                    activeDeployment === undefined
                      ? 'info'
                      : activeDeployment?.deploymentStatus === 'ACTIVE'
                      ? 'success'
                      : 'error'
                  }
                />
                <p className={classes.detail}>
                  {activeDeployment === undefined
                    ? ''
                    : activeDeployment?.deploymentStatus === 'ACTIVE'
                    ? 'Online'
                    : 'Offline'}
                </p>
              </div>
            </Cell>
          </Grid>
        }
        lowerChildren={
          <Grid>
            <Cell className={classes.reTriggerBackground} start={1}>
              <div>
                <Button
                  onClick={() => {
                    // TODO: trigger redeploy
                  }}
                  label="Trigger Redeploy"
                  appearance="secondary"
                />
              </div>

              <div className={classes.deployDetails}>
                <div className={classes.iconAndLabel}>
                  <BranchIcon />
                  <p>{project.deploymentBranch}</p>
                </div>
                <div className={classes.iconAndLabel}>
                  <CommitIcon />
                  <p>32rf343: some message</p>
                </div>
              </div>
            </Cell>
          </Grid>
        }
      />

      <Heading element="h5" className={classes.consoleHeading}>
        Latest build logs
      </Heading>

      <ExtendedBackground
        upperChildren={<div className={classes.console}>latest build logs go here</div>}
      />
    </React.Fragment>
  )
}
