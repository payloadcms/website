import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Template } from '@root/payload-cloud-types'
import { useCreateDraftProject } from '@root/utilities/use-create-draft-project'

import classes from './index.module.scss'

export const CloneTemplate: React.FC<{
  template: Template
}> = props => {
  const { template } = props
  const [name, setName] = React.useState('my-project')

  const {
    initiateProject,
    error: createError,
    isSubmitting,
  } = useCreateDraftProject({
    projectName: 'New project from import',
  })

  return (
    <Gutter>
      {createError && <p>{createError}</p>}
      <Grid>
        <Cell cols={4} colsM={8} className={classes.sidebar}>
          <p className={classes.label}>Selected template</p>
          <p>{template?.name}</p>
          <p>{template?.description}</p>
        </Cell>
        <Cell cols={8} colsM={8}>
          <Grid className={classes.projectInfo}>
            <Cell cols={4}>
              <p className={classes.label}>Git Scope</p>
              <Select
                initialValue=""
                options={[
                  {
                    label: 'None',
                    value: '',
                  },
                ]}
              />
            </Cell>
            <Cell cols={4}>
              <p className={classes.label}>Repository Name</p>
              <Text initialValue={name} onChange={setName} required />
            </Cell>
          </Grid>
          <div>
            {`Don't see your organization? `}
            <a
              href="https://docs.github.com/en/developers/apps/managing-github-apps/editing-a-github-apps-permissions"
              rel="noopener noreferrer"
              target="_blank"
            >
              Adjust your GitHub app permissions
            </a>
            {'.'}
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
