import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Text } from '@forms/fields/Text'
import Label from '@forms/Label'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { ScopeSelector } from '@components/ScopeSelector'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { Template } from '@root/payload-cloud-types'
import { useCreateDraftProject } from '@root/utilities/use-create-draft-project'
import { Install } from '@root/utilities/use-get-installs'

import classes from './index.module.scss'

export const CloneTemplate: React.FC<{
  template: Template
}> = props => {
  const { template } = props
  const [name, setName] = React.useState('my-project')
  const [selectedInstall, setSelectedInstall] = React.useState<Install | undefined>(undefined)

  const {
    initiateProject,
    error: createError,
    isSubmitting,
  } = useCreateDraftProject({
    projectName: name,
  })

  return (
    <Gutter>
      {createError && <p>{createError}</p>}
      <Grid>
        <Cell cols={4} colsM={8} className={classes.sidebar}>
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
        </Cell>
        <Cell cols={8} colsM={8}>
          <Grid className={classes.projectInfo}>
            <Cell cols={4}>
              <Label label="GitHub Scope" required htmlFor="" />
              <ScopeSelector onChange={setSelectedInstall} />
            </Cell>
            <Cell cols={4}>
              <Text label="Repository Name" initialValue={name} onChange={setName} required />
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
            <Checkbox label="Create private Git repository" />
          </div>
          <Button
            label={isSubmitting ? 'Creating...' : 'Create Project'}
            appearance="primary"
            icon="arrow"
            onClick={initiateProject}
            disabled={isSubmitting}
          />
        </Cell>
      </Grid>
    </Gutter>
  )
}
