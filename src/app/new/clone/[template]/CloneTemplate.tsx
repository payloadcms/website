'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { useInstallationSelector } from '@components/InstallationSelector'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { Checkbox } from '@forms/fields/Checkbox'
import { Text } from '@forms/fields/Text'
import Label from '@forms/Label'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { Template } from '@root/payload-cloud-types'
import { useCreateDraftProject } from '@root/utilities/use-create-draft-project'

import classes from './CloneTemplate.module.scss'

export const CloneTemplate: React.FC<{
  template?: Template
}> = props => {
  const { template } = props
  const [makePrivate, setMakePrivate] = React.useState(false)
  const [name, setName] = React.useState('my-project')
  const router = useRouter()
  const [ScopeSelector, { value: selectedInstall }] = useInstallationSelector()

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

  return (
    <Gutter>
      {createError && <p className={classes.error}>{createError}</p>}
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
                <ScopeSelector />
              </Cell>
              <Cell cols={4}>
                <Text
                  label="Repository Name"
                  initialValue={template?.slug}
                  onChange={setName}
                  required
                />
              </Cell>
            </Grid>
            <div>
              <p>
                {`Don't see your organization? `}
                <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                  Adjust your GitHub app permissions
                </a>
                {'.'}
              </p>
            </div>
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
  )
}
