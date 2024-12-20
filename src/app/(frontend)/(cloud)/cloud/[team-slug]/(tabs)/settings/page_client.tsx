'use client'

import type { TeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import type { OnSubmit } from '@forms/types.js'
import type { Team } from '@root/payload-cloud-types.js'

import { revalidateCache } from '@cloud/_actions/revalidateCache.js'
import { UniqueTeamSlug } from '@cloud/_components/UniqueSlug/index.js'
import { HR } from '@components/HR/index.js'
import { Text } from '@forms/fields/Text/index.js'
import Form from '@forms/Form/index.js'
import FormProcessing from '@forms/FormProcessing/index.js'
import FormSubmissionError from '@forms/FormSubmissionError/index.js'
import Submit from '@forms/Submit/index.js'
import { useAuth } from '@root/providers/Auth/index.js'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { SectionHeader } from '../../[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index.js'
import classes from './page.module.scss'

export const TeamSettingsPage: React.FC<{
  team: TeamWithCustomer
}> = (props) => {
  const { team } = props

  const router = useRouter()
  const { user } = useAuth()

  const [error, setError] = React.useState<{
    data: { field: string; message: string }[]
    message: string
    name: string
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
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })

      const response: {
        doc: Team
        errors: {
          data: { field: string; message: string }[]
          message: string
          name: string
        }[]
        message: string
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
      <Form className={classes.form} errors={error?.data} onSubmit={handleSubmit}>
        <FormSubmissionError />
        <FormProcessing message="Updating team, one moment..." />
        <Text initialValue={team?.name} label="Team Name" path="name" required />
        <UniqueTeamSlug initialValue={team?.slug} teamID={team?.id} />
        <Text
          initialValue={team?.billingEmail}
          label="Billing Email"
          path="billingEmail"
          required
        />
        <Submit className={classes.submit} label="Save" />
      </Form>
      <HR />
      <Text
        description="This is your team's ID within Payload"
        disabled
        label="Team ID"
        value={team?.id}
      />
    </React.Fragment>
  )
}
