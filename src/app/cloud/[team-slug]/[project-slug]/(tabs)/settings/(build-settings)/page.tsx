'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Heading } from '@components/Heading'
import { BorderBox } from '@root/app/_components/BorderBox'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { useRouteData } from '@root/app/cloud/context'

import classes from './index.module.scss'

export default () => {
  const { project } = useRouteData()

  const onSubmit = React.useCallback(
    async ({ unflattenedData }) => {
      if (!project) return

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(unflattenedData),
          },
        )

        if (res.status === 200) {
          toast.success('Settings updated successfully.')
        } else {
          toast.error('Failed to update settings.')
        }
      } catch (e) {
        toast.error('Failed to update settings.')
      }
    },
    [project],
  )

  return (
    <MaxWidth>
      <Heading element="h2" as="h4" marginTop={false}>
        Build Settings
      </Heading>
      <BorderBox>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Text
            label="Project name"
            placeholder="Enter a name for your project"
            path="name"
            initialValue={project.name}
          />

          <Text
            label="Install Command"
            placeholder="Enter the command to install your project dependencies"
            path="installScript"
            initialValue={project.installScript}
          />

          <Text
            label="Build Command"
            placeholder="Enter the command to build your project"
            path="buildScript"
            initialValue={project.buildScript}
          />

          <Text
            label="Branch to deploy"
            placeholder="Enter the branch to deploy"
            path="deploymentBranch"
            initialValue={project.deploymentBranch}
          />

          <div>
            <Submit label="Update" />
          </div>
        </Form>
      </BorderBox>
    </MaxWidth>
  )
}
