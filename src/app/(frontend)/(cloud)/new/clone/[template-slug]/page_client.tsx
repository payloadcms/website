'use client'

import type { Install } from '@cloud/_api/fetchInstalls'
import type { Team, Template, User } from '@root/payload-cloud-types'

import { fetchInstalls } from '@cloud/_api/fetchInstalls'
import { CloneOrDeployProgress } from '@cloud/_components/CloneOrDeployProgress/index'
import { InstallationSelector } from '@cloud/_components/InstallationSelector/index'
import { useTeamDrawer } from '@cloud/_components/TeamDrawer/index'
import { UniqueRepoName } from '@cloud/_components/UniqueRepoName/index'
import { cloudSlug } from '@cloud/slug'
import { Gutter } from '@components/Gutter/index'
import { HR } from '@components/HR/index'
import { Message } from '@components/Message/index'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox/index'
import Form from '@forms/Form/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Label from '@forms/Label/index'
import Submit from '@forms/Submit/index'
import { createDraftProject } from '@root/app/(frontend)/(cloud)/new/createDraftProject'
import { PayloadIcon } from '@root/graphics/PayloadIcon/index'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import classes from './page.module.scss'

export const CloneTemplate: React.FC<{
  installs?: Install[]
  template?: Template
  user: null | undefined | User
  uuid: string
}> = (props) => {
  const searchParams = useSearchParams()
  const teamParam = searchParams?.get('team')
  const { installs: initialInstalls, template, user, uuid } = props

  const router = useRouter()
  const [cloneError, setCloneError] = useState<null | string>(null)

  const [installs, setInstalls] = useState<Install[]>(initialInstalls || [])

  const [selectedInstall, setSelectedInstall] = useState<Install | undefined>(
    installs?.[0] || undefined,
  )

  const onInstall = useCallback(async () => {
    const freshInstalls = await fetchInstalls()
    setInstalls(freshInstalls)
  }, [])

  const matchedTeam = user?.teams?.find(
    ({ team }) => typeof team !== 'string' && team?.slug === teamParam,
  )?.team as Team

  const onDraftCreateProject = useCallback(
    ({ slug: draftProjectSlug, team }) => {
      toast.success('Template cloned successfully, you are now being redirected...')

      router.push(
        `/${cloudSlug}/${
          typeof team === 'string' ? team : team?.slug
        }/${draftProjectSlug}/configure`,
      )
    },
    [router],
  )

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer()
  const noTeams = !user?.teams || user?.teams.length === 0

  const handleSubmit = useCallback(
    async ({ unflattenedData }) => {
      try {
        await createDraftProject({
          installID: selectedInstall?.id,
          makePrivate: unflattenedData?.makePrivate,
          onSubmit: onDraftCreateProject,
          projectName: template?.name,
          repo: {
            name: unflattenedData?.repositoryName,
          },
          teamID: matchedTeam?.id, // the first team is used as a fallback
          templateID: template?.id,
          user,
        })
      } catch (err) {
        window.scrollTo(0, 0)
        const msg = err instanceof Error ? err.message : 'An unknown error occurred.'
        setCloneError(msg)
        console.error(msg) // eslint-disable-line no-console
      }
    },
    [user, template, selectedInstall, matchedTeam, onDraftCreateProject],
  )

  return (
    <Form onSubmit={handleSubmit}>
      <Gutter>
        {noTeams && (
          <p className={classes.noTeams}>
            {`You must be a member of a team to create a project. `}
            <TeamDrawerToggler className={classes.createTeamLink}>
              Create a new team
            </TeamDrawerToggler>
            {'.'}
          </p>
        )}
        <div className={classes.formState}>
          <FormSubmissionError />
          {cloneError && <Message error={cloneError} />}
        </div>
        <Grid>
          <Cell className={classes.sidebarCell} cols={4} colsM={8}>
            <div className={classes.sidebar}>
              <div>
                <Label htmlFor="" label="Selected Template" />
                <div className={classes.template}>
                  <div className={classes.templateIcon}>
                    <PayloadIcon />
                  </div>
                  <p className={classes.templateName}>{template?.name}</p>
                </div>
              </div>
              {template?.description && <p>{template?.description}</p>}
            </div>
          </Cell>
          <Cell cols={8} colsM={8}>
            <div className={classes.wrapper}>
              <Grid>
                <Cell cols={4}>
                  <InstallationSelector
                    description="Select where to create this repository."
                    installs={installs}
                    onChange={setSelectedInstall}
                    onInstall={onInstall}
                    uuid={uuid}
                  />
                </Cell>
                <Cell cols={4}>
                  <UniqueRepoName
                    initialValue={template?.slug}
                    repositoryOwner={(selectedInstall?.account as { login: string })?.login}
                  />
                </Cell>
              </Grid>
              <p className={classes.appPermissions}>
                {`Don't see your organization? `}
                <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                  Adjust your GitHub app permissions
                </a>
                {'.'}
              </p>
              <div>
                <Checkbox
                  initialValue={true}
                  label="Create private Git repository"
                  path="makePrivate"
                />
              </div>
              <div className={classes.submit}>
                <Submit appearance="primary" label="Clone Template" />
              </div>
            </div>
            <HR />
            <CloneOrDeployProgress
              selectedInstall={selectedInstall}
              template={template}
              type="clone"
            />
          </Cell>
        </Grid>
      </Gutter>
      <TeamDrawer />
    </Form>
  )
}
