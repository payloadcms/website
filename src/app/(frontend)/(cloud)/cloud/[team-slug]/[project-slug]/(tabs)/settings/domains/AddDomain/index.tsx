'use client'

import type { OnSubmit } from '@forms/types'
import type { Project, Team } from '@root/payload-cloud-types'

import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import Submit from '@forms/Submit/index'
import { validateDomain } from '@forms/validations'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import classes from './index.module.scss'

const generateUUID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const domainFieldPath = 'newDomain'

export const AddDomain: React.FC<{
  environmentSlug: string
  project: Project
  scopedDomains: NonNullable<Project['domains']>
  team: Team
}> = ({ environmentSlug, project, scopedDomains, team }) => {
  const [fieldKey, setFieldKey] = React.useState(generateUUID())

  const projectID = project?.id

  const router = useRouter()

  const saveDomain = React.useCallback<OnSubmit>(
    async ({ data }) => {
      const newDomain: {
        cloudflareID?: string
        domain: string
        id?: string
      } = {
        domain: data[domainFieldPath] as string,
      }

      const domainExists = scopedDomains.find(
        (projectDomain) => projectDomain.domain === newDomain.domain,
      )

      if (!domainExists) {
        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/domains?env=${encodeURIComponent(environmentSlug)}`,
            {
              body: JSON.stringify([newDomain, ...scopedDomains]),
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'PATCH',
            },
          )

          if (req.status === 200) {
            router.refresh()
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
    [projectID, scopedDomains, environmentSlug, router],
  )

  return (
    <Form className={classes.formContent} onSubmit={saveDomain}>
      <Text
        key={fieldKey}
        label="Domain"
        path={domainFieldPath}
        required
        validate={validateDomain}
      />

      <div className={classes.actionFooter}>
        <Submit appearance="secondary" icon={false} label="Save" />
      </div>
    </Form>
  )
}
