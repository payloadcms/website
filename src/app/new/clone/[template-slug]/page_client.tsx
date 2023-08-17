'use client'

import React, { useCallback } from 'react'
import { toast } from 'react-toastify'
import { Install } from '@cloud/_api/fetchInstalls'
import { useInstallationSelector } from '@cloud/_components/InstallationSelector'
import { useTeamDrawer } from '@cloud/_components/TeamDrawer'
import { UniqueRepoName } from '@cloud/_components/UniqueRepoName'
import { cloudSlug } from '@cloud/slug'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import Form from '@forms/Form'
import FormSubmissionError from '@forms/FormSubmissionError'
import Label from '@forms/Label'
import Submit from '@forms/Submit'
import { useRouter, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { HR } from '@root/app/_components/HR'
import { createDraftProject } from '@root/app/new/createDraftProject'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { Team, Template, User } from '@root/payload-cloud-types'
import { CloneProgress } from './CloneProgress'

import classes from './page.module.scss'

export const CloneTemplate: React.FC<{
  template?: Template
  installs?: Install[]
  user: User | null | undefined
}> = props => {
  const searchParams = useSearchParams()
  const teamParam = searchParams?.get('team')
  const { template, installs: initialInstalls, user } = props
  const router = useRouter()

  const [InstallationSelector, { value: selectedInstall }] = useInstallationSelector({
    installs: initialInstalls,
    permissions: 'write',
  })

  const matchedTeam = user?.teams?.find(
    ({ team }) => typeof team !== 'string' && team?.slug === teamParam,
  )?.team as Team //eslint-disable-line function-paren-newline

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
          repo: {
            name: unflattenedData?.repositoryName,
          },
          makePrivate: unflattenedData?.makePrivate,
          projectName: template?.name,
          installID: selectedInstall?.id,
          templateID: template?.id,
          teamID: matchedTeam?.id, // the first team is used as a fallback
          onSubmit: onDraftCreateProject,
          user,
        })
      } catch (error) {
        window.scrollTo(0, 0)
        console.error(error) // eslint-disable-line no-console
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
            <div className={classes.wrapper}>
              <Grid>
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
              <div>
                <Checkbox
                  label="Create private Git repository"
                  initialValue={true}
                  path="makePrivate"
                />
              </div>
              <div className={classes.submit}>
                <Submit label="Clone Template" appearance="primary" />
              </div>
            </div>
            <HR />
            <CloneProgress
              id="clone-progress"
              template={template}
              destination={selectedInstall?.account?.login}
            />
          </Cell>
        </Grid>
      </Gutter>
      <TeamDrawer />
    </Form>
  )
}
