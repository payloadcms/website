'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'

import { InviteTeammates } from '@components/InviteTeammates'
import { TeamInvitations } from '@components/TeamInvitations'
import { TeamMembers } from '@components/TeamMembers'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'

import classes from './page.module.scss'

export const TeamMembersPage: React.FC<{
  team: Team
}> = ({ team: initialTeam }) => {
  const [team, setTeam] = React.useState<Team>(initialTeam)
  const { user } = useAuth()
  const [clearCount, dispatchClearCount] = React.useReducer((state: number) => state + 1, 0)

  const [error, setError] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
  }>()

  const handleSubmit: OnSubmit = React.useCallback(
    async ({ unflattenedData, dispatchFields }): Promise<void> => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)

      if (!user) {
        toast.error('You must be logged in to update a team')
        return
      }

      setError(undefined)

      const updatedTeam: Partial<Team> = {
        ...(unflattenedData || {}),
        sendEmailInvitationsTo: unflattenedData?.sendEmailInvitationsTo?.map(invite => ({
          email: invite?.email,
          roles: invite?.roles,
        })),
      }

      const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeam),
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

      // the `invitations` property is not on the response fully
      // this is bc is has not been populated yet after the hooks send the email
      // so just grab it from `sendEmailInvitationsTo` and merge them in manually
      // we can fake the `invitedOn` date bc is not populated until _after_ the email is sent
      setTeam({
        ...response.doc,
        invitations: [
          ...(team?.invitations || []),
          ...(response.doc?.sendEmailInvitationsTo?.map(invite => ({
            email: invite?.email,
            roles: invite?.roles,
            invitedOn: new Date().toISOString(),
          })) || []),
        ],
      })

      // `sendEmailInvitationsTo` is the only field in this form
      // this means we an simply reset the whole form
      dispatchFields({
        type: 'RESET',
        payload: {
          sendEmailInvitationsTo: {
            value: [],
          },
        },
      })

      // need to also clear the array provider, though
      // this is not tied into form state but in the future we should do this
      dispatchClearCount()

      toast.success('Settings updated successfully.')
    },
    [user, team, setTeam],
  )

  return (
    <React.Fragment>
      <SectionHeader title="Team Members" />
      <Form onSubmit={handleSubmit} className={classes.form} errors={error?.data}>
        <FormSubmissionError />
        <FormProcessing message="Updating team, one moment..." />
        <TeamMembers team={team} renderHeader={false} />
        <hr className={classes.hr} />
        {team?.invitations && team?.invitations?.length > 0 && (
          <React.Fragment>
            <TeamInvitations team={team} />
            <hr className={classes.hr} />
          </React.Fragment>
        )}
        <InviteTeammates clearCount={clearCount} />
        <hr className={classes.hr} />
        <Submit label="Save" className={classes.submit} />
      </Form>
    </React.Fragment>
  )
}
