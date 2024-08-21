'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Text } from '@forms/fields/Text/index.js'
import Form from '@forms/Form/index.js'
import Submit from '@forms/Submit/index.js'
import { OnSubmit } from '@forms/types.js'
import { validateDomain } from '@forms/validations.js'

import { Project, Team } from '@root/payload-cloud-types.js'

import classes from './index.module.scss'

const generateUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const domainFieldPath = 'newDomain'

export const AddDomain: React.FC<{
  project: Project
  team: Team
}> = ({ project, team }) => {
  const [fieldKey, setFieldKey] = React.useState(generateUUID())

  const projectID = project?.id
  const projectDomains = project?.domains

  const saveDomain = React.useCallback<OnSubmit>(
    async ({ data }) => {
      // The type `Project.domains[0]` -> does not work because the array is not required - Payload type issue?
      const newDomain: {
        domain: string
        cloudflareID?: string
        id?: string
      } = {
        domain: data[domainFieldPath] as string,
      }

      const domainExists = projectDomains?.find(
        projectDomain => projectDomain.domain === newDomain.domain,
      )

      // TODO - toast messages

      if (!domainExists) {
        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}`,
            {
              method: 'PATCH',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                domains: [newDomain, ...(projectDomains || [])],
              }),
            },
          )

          if (req.status === 200) {
            // reloadProject()
            setFieldKey(generateUUID())
            toast.success('Domain added successfully.')
          }

          return
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
        }
      } else {
        setFieldKey(generateUUID())
      }
    },
    [projectID, projectDomains],
  )

  return (
    <Form className={classes.formContent} onSubmit={saveDomain}>
      <Text
        key={fieldKey}
        required
        label="Domain"
        path={domainFieldPath}
        validate={validateDomain}
      />

      <div className={classes.actionFooter}>
        <Submit icon={false} label="Save" appearance="secondary" />
      </div>
    </Form>
  )
}
