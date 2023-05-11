import * as React from 'react'
import { Collapsible } from '@faceless-ui/collapsibles'
import { Text } from '@forms/fields/Text'

import { Spinner } from '@root/app/_components/Spinner'
import { Accordion } from '@root/app/cloud/_components/Accordion'
import { useRouteData } from '@root/app/cloud/context'

export const Secret: React.FC = () => {
  const [fetchedSecret, setFetchedSecret] = React.useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { project } = useRouteData()
  const projectID = project?.id

  const fetchSecret = React.useCallback(async (): Promise<string | null> => {
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
  if (isLoading) icon = <Spinner />

  return (
    <>
      <Collapsible>
        <Accordion
          onToggle={async () => {
            if (!fetchedSecret) {
              const secretValue = await fetchSecret()
              if (secretValue) setFetchedSecret(secretValue)
            }
          }}
          label={
            <>
              <div>••••••••••••</div>
            </>
          }
        >
          <Text value={fetchedSecret} disabled icon={icon} />
        </Accordion>
      </Collapsible>
    </>
  )
}
