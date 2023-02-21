import React, { useCallback } from 'react'

import { Project } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'

export const useCreateDraftProject = ({
  projectName,
  templateID,
  onSubmit,
}: {
  projectName: string
  templateID?: string
  onSubmit?: (project: Project) => void // eslint-disable-line no-unused-vars
}): {
  initiateProject: (repoName?: string) => void // eslint-disable-line no-unused-vars
  isSubmitting: boolean
  error: string
} => {
  const { user } = useAuth()
  const [error, setError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const initiateProject = useCallback(
    async (repoName: string) => {
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
            name: projectName,
            repositoryName: repoName,
            team: typeof user.defaultTeam === 'string' ? user.defaultTeam : user.defaultTeam.id,
            template: templateID,
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
        console.error(err)
        setError(err.message)
        setIsSubmitting(false)
      }
    },
    [projectName, templateID, onSubmit, user],
  )

  return {
    initiateProject,
    isSubmitting,
    error,
  }
}
