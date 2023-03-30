'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'

import classes from './index.module.scss'

const JoinTeam: React.FC = () => {
  useAuthRedirect()
  const router = useRouter()

  const searchParams = useSearchParams()

  const team = searchParams?.get('team')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (team) {
      setLoading(true)

      const fetchTeam = async () => {
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
              `/cloud/${data?.team?.slug}?message=${encodeURIComponent(
                `Success! You have joined the '${data?.team?.name}' team!`,
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

      fetchTeam()
    }
  }, [team, router])

  return (
    <Gutter>
      <h1>Join team</h1>
      {error && <p className={classes.error}>{error}</p>}
      {loading && <p className={classes.loading}>Loading...</p>}
    </Gutter>
  )
}

export default JoinTeam
