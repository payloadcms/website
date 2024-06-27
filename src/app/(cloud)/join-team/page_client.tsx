'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter/index.js'
import { Heading } from '@components/Heading/index.js'

import classes from './page.module.scss'

export const JoinTeam: React.FC = () => {
  const router = useRouter()

  const searchParams = useSearchParams()

  const team = searchParams?.get('team')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (team) {
      setLoading(true)

      const acceptInvitation = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team}/accept-invitation`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )

          const { data, error } = await res.json()

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

      acceptInvitation()
    }
  }, [team, router])

  return (
    <Gutter>
      <Heading marginTop={false} element="h1">
        Join Team
      </Heading>
      {error && <p className={classes.error}>{error}</p>}
      {loading && <p className={classes.loading}>Loading...</p>}
    </Gutter>
  )
}
