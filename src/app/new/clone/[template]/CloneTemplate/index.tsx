'use client'

import React, { useCallback } from 'react'
import { Install } from '@cloud/_api/fetchInstalls'
import { useInstallationSelector } from '@cloud/_components/InstallationSelector'
import { useTeamDrawer } from '@cloud/_components/TeamDrawer'
import { UniqueRepoName } from '@cloud/_components/UniqueRepoName'
import { cloudSlug } from '@cloud/slug'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Label from '@forms/Label'
import Submit from '@forms/Submit'
import { useRouter, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { useCreateDraftProject } from '@root/app/new/useCreateDraftProject'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { Team, Template } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'

import classes from './index.module.scss'

export const CloneTemplate: React.FC<{
  template?: Template
  installs?: Install[]
}> = props => {
  const searchParams = useSearchParams()
  const teamParam = searchParams?.get('team')
  const { user } = useAuth()
  const { template, installs: initialInstalls } = props
  const router = useRouter()

  const [InstallationSelector, { value: selectedInstall }] = useInstallationSelector({
    installs: initialInstalls,
    permissions: 'write',
  })

  const matchedTeam = user?.teams?.find(
    ({ team }) => typeof team !== 'string' && team?.slug === teamParam,
  )?.team as Team //eslint-disable-line function-paren-newline

  const createDraftProject = useCreateDraftProject({
    projectName: template?.name,
    installID: selectedInstall?.id,
    templateID: template?.id,
    teamID: matchedTeam?.id, // the first team is used as a fallback
    onSubmit: ({ slug: draftProjectSlug, team }) =>
      router.push(
        `/${cloudSlug}/${
          typeof team === 'string' ? team : team?.slug
        }/${draftProjectSlug}/configure`,
      ),
  })

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer()
  const noTeams = !user?.teams || user?.teams.length === 0

  const handleSubmit = useCallback(
    async ({ unflattenedData }) => {
      await createDraftProject({
        repo: {
          name: unflattenedData?.repositoryName,
        },
        makePrivate: unflattenedData?.makePrivate,
      })
    },
    [createDraftProject],
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
          <FormProcessing message="Cloning template, this process may take a few minutes..." />
          <FormSubmissionError banner />
        </div>
        <Grid>
          <Cell cols={4} colsM={8} className={classes.sidebarCell}>
            <div className={classes.sidebar}>
              <div>
                <Label label="Selected Template" htmlFor="" />
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
            <Grid className={classes.projectInfo}>
              <Cell cols={4}>
                <InstallationSelector description="Select where to create this repository." />
              </Cell>
              <Cell cols={4}>
                <UniqueRepoName
                  repositoryOwner={selectedInstall?.account?.login}
                  initialValue={template?.slug}
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
            <div className={classes.createPrivate}>
              <Checkbox
                label="Create private Git repository"
                initialValue={true}
                path="makePrivate"
              />
            </div>
            <Submit label="Create Project" appearance="primary" />
          </Cell>
        </Grid>
      </Gutter>
      <TeamDrawer />
    </Form>
  )
}
