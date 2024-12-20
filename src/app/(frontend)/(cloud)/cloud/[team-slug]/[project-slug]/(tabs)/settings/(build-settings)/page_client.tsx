'use client'

import type { Project, Team } from '@root/payload-cloud-types.js'

import { BranchSelector } from '@cloud/_components/BranchSelector/index.js'
import { UniqueProjectSlug } from '@cloud/_components/UniqueSlug/index.js'
import { MaxWidth } from '@components/MaxWidth/index.js'
import { Text } from '@forms/fields/Text/index.js'
import Form from '@forms/Form/index.js'
import Submit from '@forms/Submit/index.js'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants.js'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { SectionHeader } from '../_layoutComponents/SectionHeader/index.js'
import classes from './page.module.scss'

export const ProjectBuildSettingsPage: React.FC<{
  environmentSlug: string
  project: Project
  team: Team
}> = ({ environmentSlug, project, team }) => {
  const router = useRouter()

  const [error, setError] = React.useState<{
    data: { field: string; message: string }[]
    message: string
    name: string
  }>()

  const onSubmit = React.useCallback(
    async ({ unflattenedData }) => {
      if (!project) {return}

      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}/build-settings${
            environmentSlug ? `?env=${environmentSlug}` : ''
          }`,
          {
            body: JSON.stringify(unflattenedData),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
        )

        const response: {
          doc: Project
          errors: {
            data: { field: string; message: string }[]
            message: string
            name: string
          }[]
          message: string
        } = await req.json()

        if (!req.ok) {
          toast.error(`Failed to update settings: ${response?.errors?.[0]?.message}`)
          setError(response?.errors?.[0])
          return
        }

        setError(undefined)
        toast.success('Settings updated successfully.')

        // if the project slug has changed, redirect to the new URL (only for production environments)
        if (
          environmentSlug === PRODUCTION_ENVIRONMENT_SLUG &&
          response.doc.slug !== project?.slug
        ) {
          router.push(
            `/cloud/${typeof project.team === 'string' ? project.team : project.team?.slug}/${
              response.doc.slug
            }/settings`,
          )
          return
        }
      } catch (e) {
        toast.error('Failed to update settings.')
        throw e
      }
    },
    [project, router],
  )

  return (
    <MaxWidth>
      <SectionHeader title="Build Settings" />
      {error ? JSON.stringify(error) : null}
      <Form className={classes.form} errors={error?.data} onSubmit={onSubmit}>
        <Text
          initialValue={project?.name}
          label="Project name"
          path="name"
          placeholder="Enter a name for your project"
          required
        />
        <UniqueProjectSlug
          disabled={environmentSlug !== 'prod'}
          initialValue={project?.slug}
          projectID={project?.id}
          teamID={typeof project?.team === 'string' ? project?.team : project?.team?.id}
        />
        <Text
          initialValue={project?.rootDirectory || '/'}
          label="Root Directory"
          path="rootDirectory"
          placeholder="/"
          required
        />
        <Text
          description="Example: `pnpm install` or `npm install`"
          initialValue={project?.installScript}
          label="Install Command"
          path="installScript"
          placeholder="pnpm install"
          required
        />
        <Text
          description="Example: `pnpm build` or `npm run build`"
          initialValue={project?.buildScript}
          label="Build Command"
          path="buildScript"
          placeholder="pnpm build"
          required
        />
        <Text
          description="Example: `pnpm serve` or `npm run serve`"
          initialValue={project?.runScript}
          label="Serve Command"
          path="runScript"
          placeholder="pnpm serve"
          required
        />
        <Text
          description="This was set when your project was first deployed."
          disabled
          initialValue={project?.repositoryFullName}
          label="Repository"
          required
        />
        <BranchSelector
          initialValue={project?.deploymentBranch}
          repositoryFullName={project?.repositoryFullName}
        />
        <Text
          description="Example: A Dockerfile in a src directory would require `src/Dockerfile`"
          initialValue={project?.dockerfilePath}
          label="Dockerfile Path"
          path="dockerfilePath"
        />
        <div>
          <Submit label="Update" />
        </div>
      </Form>
    </MaxWidth>
  )
}
