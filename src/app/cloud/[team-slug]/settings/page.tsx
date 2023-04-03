'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { InviteTeammates } from '@components/InviteTeammates'
import { TeamInvitations } from '@components/TeamInvitations'
import { TeamMembers } from '@components/TeamMembers'
import { UniqueTeamSlug } from '@components/UniqueSlug'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { useRouteData } from '../../context'

import classes from './page.module.scss'

export default () => {
  const { team, setTeam } = useRouteData()
  const { user } = useAuth()
  const [error, setError] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
  }>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)

  const handleSubmit: OnSubmit = React.useCallback(
    async ({ unflattenedData, dispatchFields }) => {
      if (user) {
        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 0)

        setLoading(true)
        setError(undefined)

        const updatedTeam: Partial<Team> = {
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
        setError(undefined)
        setSuccess(true)
        setTeam(response.doc)

        // TODO: update the form state with the new team data
        // dispatchFields({
        //   type: 'REPLACE_STATE',
        //   state:
        // })
      }
    },
    [user, team, setTeam],
  )

  return (
    <Gutter className={classes.settings}>
      <Heading marginTop={false} element="h1" as="h6" className={classes.title}>
        Team settings
      </Heading>
      {(success || error || loading) && (
        <div className={classes.formState}>
          {success && <p className={classes.success}>Team updated successfully!</p>}
          {error && <p className={classes.error}>{error?.message}</p>}
          {loading && <p className={classes.loading}>Updating team...</p>}
        </div>
      )}
      <Grid>
        <Cell cols={6} colsM={8}>
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
            <Text path="name" label="Team Name" />
            <UniqueTeamSlug teamID={team?.id} />
            <Text path="billingEmail" label="Billing Email" required />
            <hr className={classes.hr} />
            <TeamMembers team={team} />
            {team?.invitations && team?.invitations?.length > 0 && (
              <React.Fragment>
                <hr className={classes.hr} />
                <TeamInvitations team={team} />
              </React.Fragment>
            )}
            <hr className={classes.hr} />
            <InviteTeammates />
            <hr className={classes.hr} />
            <Submit label="Save" className={classes.submit} />
          </Form>
        </Cell>
      </Grid>
    </Gutter>
  )
}
