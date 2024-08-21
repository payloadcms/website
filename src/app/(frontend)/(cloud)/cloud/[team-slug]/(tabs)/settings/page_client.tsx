'use client'

import * as React from 'react'
import { revalidateCache } from '@cloud/_actions/revalidateCache.js'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { UniqueTeamSlug } from '@cloud/_components/UniqueSlug/index.js'
import { Text } from '@forms/fields/Text/index.js'
import Form from '@forms/Form/index.js'
import FormProcessing from '@forms/FormProcessing/index.js'
import FormSubmissionError from '@forms/FormSubmissionError/index.js'
import Submit from '@forms/Submit/index.js'
import { OnSubmit } from '@forms/types.js'
import { useRouter } from 'next/navigation'

import { HR } from '@components/HR/index.js'
import { Team } from '@root/payload-cloud-types.js'
import { useAuth } from '@root/providers/Auth/index.js'
import { SectionHeader } from '../../[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index.js'

import classes from './page.module.scss'
import { toast } from 'sonner'

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

      toast.success(`Team settings updated successfully.`)

      await revalidateCache({
        tag: `team_${team?.id}`,
      })

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
