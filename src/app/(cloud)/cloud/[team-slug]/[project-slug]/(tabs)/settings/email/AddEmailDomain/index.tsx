'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'
import { validateDomain } from '@forms/validations'

import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

const generateUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const emailDomainFieldPath = 'newEmailDomain'

export const AddEmailDomain: React.FC<{
  project: Project
}> = ({ project }) => {
  const [fieldKey, setFieldKey] = React.useState(generateUUID())

  const projectID = project?.id
  const projectEmailDomains = project?.customEmailDomains

  const saveEmailDomain = React.useCallback<OnSubmit>(
    async ({ data }) => {
      const newEmailDomain: {
        domain: string
        cloudflareID?: string
        id?: string
      } = {
        domain: data[emailDomainFieldPath] as string,
      }

      const domainExists = projectEmailDomains?.find(
        projectEmailDomains => projectEmailDomains.domain === newEmailDomain.domain,
      )

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
                customEmailDomains: [newEmailDomain, ...(projectEmailDomains || [])],
              }),
            },
          )

          if (req.status === 200) {
            // reloadProject()
            setFieldKey(generateUUID())
            toast.success('Domain added successfully.')
          } else {
            const body = await req.json()
            toast.error(body.errors?.[0]?.message ?? 'Something went wrong.')
          }

          return
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
        }
      } else {
        setFieldKey(generateUUID())
        toast.error('Domain already exists.')
      }
    },
    [projectID, projectEmailDomains],
  )

  return (
    <Form className={classes.formContent} onSubmit={saveEmailDomain}>
      <Text
        key={fieldKey}
        required
        label="Domain"
        path={emailDomainFieldPath}
        validate={validateDomain}
      />

      <div className={classes.actionFooter}>
        <Submit icon={false} label="Save" />
      </div>
    </Form>
  )
}
