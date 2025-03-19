'use client'

import type { Project } from '@root/payload-cloud-types'

import { Accordion } from '@components/Accordion/index'
import { Spinner } from '@components/Spinner/index'
import { Text } from '@forms/fields/Text/index'
import * as React from 'react'

export const Secret: React.FC<{
  project: Project
}> = ({ project }) => {
  const [fetchedSecret, setFetchedSecret] = React.useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const projectID = project?.id

  const fetchSecret = React.useCallback(async (): Promise<null | string> => {
    let timer: NodeJS.Timeout

    timer = setTimeout(() => {
      setIsLoading(true)
    }, 200)

    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/secret`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      clearTimeout(timer)

      if (req.status === 200) {
        const res = await req.json()
        setIsLoading(false)

        return res.PAYLOAD_SECRET
      }
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
      setIsLoading(false)
    }

    return null
  }, [projectID])

  let icon: React.ReactNode = null
  if (isLoading) {
    icon = <Spinner />
  }

  return (
    <Accordion
      label={
        <>
          <div>••••••••••••</div>
        </>
      }
      onToggle={async () => {
        if (!fetchedSecret) {
          const secretValue = await fetchSecret()
          if (secretValue) {
            setFetchedSecret(secretValue)
          }
        }
      }}
      toggleIcon="eye"
    >
      <Text disabled icon={icon} value={fetchedSecret} />
    </Accordion>
  )
}
