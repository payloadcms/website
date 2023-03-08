'use client'

import * as React from 'react'

import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { useRouteData } from '@root/app/dashboard/context'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

const validateDomain = (domainValue: string) => {
  if (!domainValue) {
    return 'Please enter a domain'
  }

  const validDomainRegex = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/ // source: https://www.regextester.com/103452
  if (!domainValue.match(validDomainRegex)) {
    return `"${domainValue}" is not a fully qualified domain name.`
  }

  return true
}

const domainFieldPath = 'newDomain'

export const AddDomain: React.FC = () => {
  const { project, reloadProject } = useRouteData()

  const projectID = project.id
  const projectDomains = project?.domains

  const saveDomain = React.useCallback(
    async ({ data }) => {
      const newDomain: Project['domains'][0] = {
        domain: data[domainFieldPath],
        status: 'pending',
        records: [],
      }

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
        }

        return
      } catch (e) {
        console.error(e)
      }

      // TODO: clear form
    },
    [projectID, reloadProject, projectDomains],
  )

  return (
    <Form className={classes.formContent} onSubmit={saveDomain}>
      <Text required label="Domain" path={domainFieldPath} validate={validateDomain} />

      <div className={classes.actionFooter}>
        <Submit icon={false} label="Save" appearance="secondary" size="small" />
      </div>
    </Form>
  )
}
