import React, { useEffect } from 'react'

import type { Project, Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'

export const useGetProjects = (props: {
  selectedTeam: Team | undefined
  delay?: number
}): {
  error: string | undefined
  loading: boolean
  projects: Project[]
} => {
  const { selectedTeam, delay = 250 } = props
  const [error, setError] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState(true)
  const [projects, setProjects] = React.useState<Project[]>([])
  const { user } = useAuth()

  useEffect(() => {
    setLoading(true)
    let timeout: NodeJS.Timeout

    if (user && selectedTeam) {
      const getProjects = async (): Promise<void> => {
        const projectsReq = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects${
            selectedTeam ? `?where[team][equals]=${selectedTeam.id}` : ''
          }`,
          {
            credentials: 'include',
          },
        )

        const res = await projectsReq.json()

        if (projectsReq.ok) {
          timeout = setTimeout(() => {
            setProjects(res.docs)
            setLoading(false)
          }, delay)
          setError(undefined)
        } else {
          setError(res.error)
          setLoading(false)
        }
      }

      getProjects()
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [user, selectedTeam, delay])

  return {
    projects,
    error,
    loading,
  }
}
