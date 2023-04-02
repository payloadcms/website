'use client'

import React, { Fragment } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Text } from '@forms/fields/Text'
import Label from '@forms/Label'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { useInstallationSelector } from '@components/InstallationSelector'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { useTeamDrawer } from '@components/TeamDrawer'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { Template } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { useCreateDraftProject } from '@root/utilities/use-create-draft-project'

import classes from './CloneTemplate.module.scss'

export const CloneTemplate: React.FC<{
  template?: Template
}> = props => {
  const { user } = useAuth()
  const { template } = props
  const [makePrivate, setMakePrivate] = React.useState(false)
  const [name, setName] = React.useState(template?.slug)
  const router = useRouter()
  const [InstallationSelector, { value: selectedInstall }] = useInstallationSelector()

  const {
    submitDraftProject,
    error: createError,
    isSubmitting,
  } = useCreateDraftProject({
    projectName: template?.name,
    installID: selectedInstall?.id,
    templateID: template?.id,
    makePrivate,
    onSubmit: ({ id: draftProjectID }) => {
      router.push(`/new/clone/configure/${draftProjectID}`)
    },
  })

  const [TeamDrawer, TeamDrawerToggler] = useTeamDrawer()

  return (
    <Fragment>
      <Gutter>
        <div className={classes.errors}>
          {!user?.teams ||
            (user?.teams.length === 0 && (
              <p>
                {`You must be a member of a team to create a project. `}
                <TeamDrawerToggler className={classes.createTeamLink}>
                  Create a new team
                </TeamDrawerToggler>
                {'.'}
              </p>
            ))}
          {createError && <p>{createError}</p>}
        </div>
        {isSubmitting && <LoadingShimmer number={3} />}
        {!isSubmitting && (
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
                <p>{template?.description}</p>
              </div>
            </Cell>
            <Cell cols={8} colsM={8}>
              <Grid className={classes.projectInfo}>
                <Cell cols={4}>
                  <InstallationSelector description="Select where to create this repository." />
                </Cell>
                <Cell cols={4}>
                  <Text
                    label="Repository Name"
                    initialValue={template?.slug}
                    onChange={setName}
                    required
                    description="Give the newly created repository a name."
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
                  initialValue={makePrivate}
                  onChange={setMakePrivate}
                />
              </div>
              <Button
                label={isSubmitting ? 'Creating...' : 'Create Project'}
                appearance="primary"
                icon="arrow"
                onClick={() => {
                  submitDraftProject({
                    repo: {
                      name,
                    },
                  })
                }}
                disabled={isSubmitting}
              />
            </Cell>
          </Grid>
        )}
      </Gutter>
      <TeamDrawer />
    </Fragment>
  )
}
