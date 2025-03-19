'use client'

import type { OnSubmit } from '@forms/types'
import type { Project } from '@root/payload-cloud-types'

import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import Submit from '@forms/Submit/index'
import { validateDomain } from '@forms/validations'
import * as React from 'react'
import { toast } from 'sonner'

import classes from './index.module.scss'

const generateUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const emailDomainFieldPath = 'newEmailDomain'

export const AddEmailDomain: React.FC<{
  environmentSlug: string
  project: Project
}> = ({ environmentSlug, project }) => {
  const [fieldKey, setFieldKey] = React.useState(generateUUID())

  const projectID = project?.id
  const projectEmailDomains = project?.customEmailDomains

  const saveEmailDomain = React.useCallback<OnSubmit>(
    async ({ data }) => {
      const newEmailDomain: {
        cloudflareID?: string
        domain: string
        id?: string
      } = {
        domain: data[emailDomainFieldPath] as string,
      }

      const domainExists = projectEmailDomains?.find(
        (projectEmailDomains) => projectEmailDomains.domain === newEmailDomain.domain,
      )

      if (!domainExists) {
        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}${
              environmentSlug ? `?env=${environmentSlug}` : ''
            }`,
            {
              body: JSON.stringify({
                customEmailDomains: [newEmailDomain, ...(projectEmailDomains || [])],
              }),
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'PATCH',
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
        label="Domain"
        path={emailDomainFieldPath}
        required
        validate={validateDomain}
      />

      <div className={classes.actionFooter}>
        <Submit icon={false} label="Save" />
      </div>
    </Form>
  )
}
