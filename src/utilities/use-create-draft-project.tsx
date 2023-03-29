import React, { useCallback } from 'react'

import { Project } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { Repo } from './use-get-repos'

export const useCreateDraftProject = ({
  projectName,
  installID,
  templateID,
  makePrivate,
  onSubmit,
}: {
  projectName?: string
  installID?: number
  onSubmit?: (project: Project) => void // eslint-disable-line no-unused-vars
  templateID?: string // only applies to `clone` flow
  makePrivate?: boolean // only applies to `clone` flow
}): {
  submitDraftProject: (args?: { repo: Repo }) => void // eslint-disable-line no-unused-vars
  isSubmitting: boolean
  error: string
} => {
  const { user } = useAuth()
  const [error, setError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const submitDraftProject = useCallback(
    async ({ repo }: { repo: Repo }) => {
      if (!user) {
        return
      }

      if (!user.teams || user.teams.length === 0) {
        setError('You must be a member of a team to create a project')
        return
      }

      window.scrollTo(0, 0)
      setError('')
      setIsSubmitting(true)

      try {
        const projectReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: projectName || repo?.name || 'Untitled Project',
            installID,
            team:
              typeof user.teams?.[0]?.team === 'string'
                ? user.teams?.[0]?.team
                : user.teams?.[0]?.team?.id,
            defaultDomain: undefined,
            repositoryID: repo?.id, // only applies to the `import` flow
            repositoryName: repo?.name,
            repositoryFullName: repo?.full_name,
            template: templateID,
            makePrivate,
          }),
        })

        const { doc: project, errors: projectErrs } = await projectReq.json()

        if (projectReq.ok) {
          if (typeof onSubmit === 'function') {
            onSubmit(project)
          }
        } else {
          setError(`Error creating project: ${projectErrs[0].message}`)
          setIsSubmitting(false)
        }
      } catch (err) {
        console.error(err) // eslint-disable-line no-console
        setError(err.message)
        setIsSubmitting(false)
      }
    },
    [projectName, templateID, onSubmit, user, installID, makePrivate],
  )

  return {
    submitDraftProject,
    isSubmitting,
    error,
  }
}
