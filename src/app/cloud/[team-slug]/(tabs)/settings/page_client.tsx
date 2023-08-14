'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { UniqueTeamSlug } from '@cloud/_components/UniqueSlug'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'
import { useRouter } from 'next/navigation'

import { HR } from '@root/app/_components/HR'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { SectionHeader } from '../../[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'

import classes from './page.module.scss'

export const TeamSettingsPage: React.FC<{
  team: TeamWithCustomer
}> = props => {
  const { team } = props

  const router = useRouter()
  const { user } = useAuth()

  const [error, setError] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
  }>()

  const handleSubmit: OnSubmit = React.useCallback(
    async ({ data, dispatchFields }): Promise<void> => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)

      if (!user) {
        // throw new Error('You must be logged in to update a team')
        return
      }

      setError(undefined)

      const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const response: {
        doc: Team
        message: string
        errors: {
          message: string
          name: string
          data: { message: string; field: string }[]
        }[]
      } = await req.json()

      if (!req.ok) {
        toast.error(`Failed to update settings: ${response?.errors?.[0]?.message}`)
        setError(response?.errors?.[0])
        return
      }

      setError(undefined)
      toast.success('Settings updated successfully.')

      // if the team slug has changed, redirect to the new URL
      if (response.doc.slug !== team?.slug) {
        router.push(`/cloud/${response.doc.slug}/settings`)
        return
      }
    },
    [user, team, router],
  )

  return (
    <React.Fragment>
      <SectionHeader title="Team Settings" />
      <Form onSubmit={handleSubmit} className={classes.form} errors={error?.data}>
        <FormSubmissionError />
        <FormProcessing message="Updating team, one moment..." />
        <Text path="name" label="Team Name" required initialValue={team?.name} />
        <UniqueTeamSlug teamID={team?.id} initialValue={team?.slug} />
        <Text
          path="billingEmail"
          label="Billing Email"
          required
          initialValue={team?.billingEmail}
        />
        <Submit label="Save" className={classes.submit} />
      </Form>
      <HR />
      <Text
        value={team?.id}
        label="Team ID"
        disabled
        description="This is your team's ID within Payload"
      />
    </React.Fragment>
  )
}
