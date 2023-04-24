import React, { useCallback } from 'react'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'

import { UniqueTeamSlug } from '@components/UniqueSlug'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { InviteTeammates } from '../InviteTeammates'
import { TeamDrawerProps } from './types'

import classes from './DrawerContent.module.scss'

export const TeamDrawerContent: React.FC<TeamDrawerProps> = ({
  drawerSlug,
  onCreate,
  closeDrawer,
}) => {
  const { user, setUser } = useAuth()
  const [errors, setErrors] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
  }>()

  const { modalState } = useModal()

  const handleSubmit = useCallback(
    async ({ unflattenedData }) => {
      if (user) {
        // TODO: access the ref directly, might need to publish a `forwardRef` modal or add it to context
        // pretty sure this doesn't work anyway
        const modalRef = document.querySelector(`[id^="${drawerSlug}"]`)

        if (modalRef) {
          setTimeout(() => {
            modalRef.scrollTop = 0
          }, 0)
        }

        const newTeam: Team = {
          ...(unflattenedData || {}),
          billingEmail: user?.email,
          // flatten `roles` to an array of values
          // there's probably a better way to do this like using `flattenedData` or modifying the API handler
          sendEmailInvitationsTo: unflattenedData?.sendEmailInvitationsTo?.map(invite => ({
            email: invite?.email,
            roles: invite?.roles?.map(role => role?.value),
          })),
        }

        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTeam),
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
          setErrors(response?.errors?.[0])
          throw new Error(response?.errors?.[0]?.message)
        }

        setUser({
          ...user,
          teams: [
            ...(user?.teams || []),
            // the api adds the user as an owner automatically, need to sync that here
            // this data does not come back from the API in the response
            {
              team: response?.doc,
              roles: ['owner'],
            },
          ],
        })

        if (typeof onCreate === 'function') onCreate(response?.doc)

        closeDrawer()
      }
    },
    [onCreate, user, drawerSlug, closeDrawer, setUser],
  )

  const isOpen = modalState[drawerSlug]?.isOpen

  if (!isOpen) return null

  return (
    <div className="list-drawer__content">
      <Form
        onSubmit={handleSubmit}
        className={classes.form}
        errors={errors?.data}
        initialState={{
          name: {
            initialValue: 'My Team',
            value: 'My Team',
          },
          slug: {
            initialValue: '',
            value: '',
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
        <FormProcessing message="Creating team..." />
        <FormSubmissionError />
        <Text path="name" required label="Name" />
        <UniqueTeamSlug />
        <hr className={classes.hr} />
        <InviteTeammates />
        <hr className={classes.hr} />
        <div>
          <Submit label="Create Team" className={classes.submit} />
        </div>
      </Form>
    </div>
  )
}
