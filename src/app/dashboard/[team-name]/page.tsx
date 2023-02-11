'use client'

import React from 'react'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'

export default () => {
  const { user } = useAuth()

  React.useEffect(() => {
    const fetchTeam = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams?where[name][equals]=TRBL`
      const res = await fetch(endpoint, {
        credentials: 'include',
      })
      const teamData = await res.json()
      console.log({ teamData })
    }
    fetchTeam()
  }, [])

  return (
    <Gutter>
      <Heading marginTop={false}>Team Projects</Heading>
      <p>{`Email: ${user?.email}`}</p>
      <Button appearance="primary" label="New project" href="/new" el="link" />
      <br />
      <br />
      <Button appearance="secondary" label="Logout" href="/logout" el="link" />
    </Gutter>
  )
}
