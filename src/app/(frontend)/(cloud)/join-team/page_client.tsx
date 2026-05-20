'use client'

import { Gutter } from '@components/Gutter/index.js'
import { Heading } from '@components/Heading/index.js'
import { isValidParamID } from '@root/utilities/isValidParamID'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import classes from './page.module.scss'

export const JoinTeam: React.FC = () => {
  const router = useRouter()

  const searchParams = useSearchParams()

  const team = searchParams?.get('team')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    if (isValidParamID(team)) {
      setLoading(true)

      const acceptInvitation = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team}/accept-invitation`,
            {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
            },
          )

          const {
            data,
            error,
          }: { data: { team: { id: string; name: string; slug: string } }; error: string } =
            await res.json()

          if (res.status === 200) {
            router.push(
              `/cloud/${data?.team?.slug}?success=${encodeURIComponent(
                `You have joined the '${data?.team?.name}' team.`,
              )}`,
            )
          } else {
            throw new Error(error)
          }
        } catch (e: any) {
          setError(`An error occurred while accepting team invitation: ${e.message}`)
          setLoading(false)
        }
      }

      void acceptInvitation()
    }
  }, [team, router])

  return (
    <Gutter>
      <Heading element="h1" marginTop={false}>
        Join Team
      </Heading>
      {error && <p className={classes.error}>{error}</p>}
      {loading && <p className={classes.loading}>Loading...</p>}
    </Gutter>
  )
}
