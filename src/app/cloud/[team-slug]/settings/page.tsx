'use client'

import * as React from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { InviteTeammates } from '@components/InviteTeammates'
import { TeamInvitations } from '@components/TeamInvitations'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { useRouteData } from '../../context'

import classes from './page.module.scss'

export default () => {
  const { team } = useRouteData()
  const { user } = useAuth()
  const [error, setError] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
  }>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)

  const handleSubmit = React.useCallback(
    async ({ unflattenedData }) => {
      if (user) {
        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 0)

        setLoading(true)

        const updatedTeam: Team = {
          ...(unflattenedData || {}),
          // flatten `roles` to an array of values
          // there's probably a better way to do this like using `flattenedData` or modifying the API handler
          sendEmailInvitationsTo: unflattenedData?.sendEmailInvitationsTo?.map(invite => ({
            email: invite?.email,
            roles: invite?.roles?.map(role => role?.value),
          })),
        }

        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team.id}`, {
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
          setError(response?.errors?.[0])
          setLoading(false)
          return
        }

        setLoading(false)
        setSuccess(true)
      }
    },
    [user, team],
  )

  return (
    <Gutter className={classes.settings}>
      <Heading marginTop={false} element="h1" as="h6" className={classes.title}>
        Team settings
      </Heading>
      <div className={classes.formState}>
        {success && <p>Team updated successfully</p>}
        {error && <p className={classes.error}>{error?.message}</p>}
        {loading && <p>Updating team...</p>}
      </div>
      <Form
        onSubmit={handleSubmit}
        className={classes.form}
        errors={error?.data}
        initialState={{
          name: {
            initialValue: team?.name,
            value: team?.name,
          },
          slug: {
            initialValue: team?.slug,
            value: team?.slug,
          },
          billingEmail: {
            initialValue: team?.billingEmail,
            value: team?.billingEmail,
          },
          sendEmailInvitationsTo: {
            initialValue: [
              {
                email: '',
                roles: ['user'],
              },
            ],
          },
        }}
      >
        <Text path="name" label="Name" />
        <Text path="slug" label="Slug" required />
        <Text path="billingEmail" label="Billing Email" required />
        {team?.invitations && team?.invitations?.length > 0 && <TeamInvitations team={team} />}
        <InviteTeammates />
        <Submit label="Save" className={classes.submit} />
      </Form>
    </Gutter>
  )
}
