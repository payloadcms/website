'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { useRouter } from 'next/navigation'

import { BranchSelector } from '@components/BranchSelector'
import { UniqueProjectSlug } from '@components/UniqueSlug'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { useRouteData } from '@root/app/cloud/context'
import { Team } from '@root/payload-cloud-types'
import { SectionHeader } from '../_layoutComponents/SectionHeader'

import classes from './index.module.scss'

export const ProjectBuildSettingsPage = () => {
  const { project } = useRouteData()
  const router = useRouter()

  const [error, setError] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
  }>()

  const onSubmit = React.useCallback(
    async ({ unflattenedData }) => {
      if (!project) return

      try {
        const req = await fetch(
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

        const response: {
          doc: Team
          message: string
          errors: {
            message: string
            name: string
            data: { message: string; field: string }[]
          }[]
        } = await req.json()

        if (!req.ok) {
          toast.error(`Failed to update settings: ${response?.errors?.[0]?.message}`)
          setError(response?.errors?.[0])
          return
        }

        setError(undefined)
        toast.success('Settings updated successfully.')

        // if the project slug has changed, redirect to the new URL
        if (response.doc.slug !== project?.slug) {
          router.push(
            `/cloud/${typeof project.team === 'string' ? project.team : project.team?.slug}/${
              response.doc.slug
            }/settings`,
          )
          return
        }
      } catch (e) {
        toast.error('Failed to update settings.')
      }
    },
    [project, router],
  )

  return (
    <MaxWidth>
      <SectionHeader title="Build Settings" />
      <Form className={classes.form} onSubmit={onSubmit} errors={error?.data}>
        <Text
          label="Project name"
          placeholder="Enter a name for your project"
          path="name"
          initialValue={project?.name}
          required
        />
        <UniqueProjectSlug
          teamID={typeof project?.team === 'string' ? project?.team : project?.team?.id}
          projectID={project?.id}
          initialValue={project?.slug}
        />
        <Text
          label="Root Directory"
          placeholder="/"
          path="rootDirectory"
          initialValue={project?.rootDirectory || '/'}
          required
        />
        <Text
          label="Install Command"
          placeholder="yarn install"
          description="Example: `yarn install` or `npm install`"
          path="installScript"
          initialValue={project?.installScript}
          required
        />
        <Text
          label="Build Command"
          placeholder="yarn build"
          description="Example: `yarn build` or `npm run build`"
          path="buildScript"
          initialValue={project?.buildScript}
          required
        />
        <Text
          label="Serve Command"
          placeholder="yarn serve"
          description="Example: `yarn serve` or `npm run serve`"
          path="runScript"
          initialValue={project?.runScript}
          required
        />
        <Text
          label="Repository"
          initialValue={project?.repositoryFullName}
          required
          disabled
          description="This was set when your project was first deployed."
        />
        <BranchSelector
          repositoryFullName={project?.repositoryFullName}
          initialValue={project?.deploymentBranch}
        />
        <div>
          <Submit label="Update" />
        </div>
      </Form>
    </MaxWidth>
  )
}
