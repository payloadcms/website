import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'

export const useCreateDraftProject = ({
  projectName,
  templateID,
}: {
  projectName: string
  templateID?: string
}): {
  initiateProject: (repoName?: string) => void // eslint-disable-line no-unused-vars
  isSubmitting: boolean
  error: string
} => {
  const [error, setError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const initiateProject = useCallback(
    async (repoName: string) => {
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
            // owner: 'TEAM_ID', // TODO get this from the URL
            template: templateID,
          }),
        })

        const { doc: project, error: projectErr } = await projectReq.json()

        if (projectReq.ok) {
          // TODO: make this route real
          router.push(`/dashboard/projects/${project.slug}`)
        } else {
          setError(projectErr)
          setIsSubmitting(false)
        }
      } catch (err) {
        console.error(err)
        setError(err.message)
        setIsSubmitting(false)
      }
    },
    [router, projectName, templateID],
  )

  return {
    initiateProject,
    isSubmitting,
    error,
  }
}
