'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'
import { validateDomain } from '@forms/validations'

import { useRouteData } from '@root/app/cloud/context'

// import { Project } from '@root/payload-cloud-types'
import classes from './index.module.scss'

const generateUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const domainFieldPath = 'newDomain'

export const AddDomain: React.FC = () => {
  const { project, reloadProject } = useRouteData()
  const [fieldKey, setFieldKey] = React.useState(generateUUID())

  const projectID = project.id
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
            reloadProject()
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
    [projectID, reloadProject, projectDomains],
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
