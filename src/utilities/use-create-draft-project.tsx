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
  isLoading: boolean
  error: string
} => {
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const initiateProject = useCallback(
    async (repoName: string) => {
      setIsLoading(true)

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
          setIsLoading(false)
        }
      } catch (err) {
        console.error(err)
        setError(err.message)
        setIsLoading(false)
      }
    },
    [router, projectName, templateID],
  )

  return {
    initiateProject,
    isLoading,
    error,
  }
}
