import React, { useCallback } from 'react'
import { useModal } from '@faceless-ui/modal'

import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { TeamMembers } from './TeamMembers'
import { TeamDrawerProps } from './types'

import classes from './DrawerContent.module.scss'

export const TeamDrawerContent: React.FC<TeamDrawerProps> = ({
  drawerSlug,
  onCreate,
  closeDrawer,
}) => {
  const { user } = useAuth()
  const [error, setError] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
  }>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)

  const { modalState } = useModal()

  const handleSubmit = useCallback(
    async ({ data }) => {
      // TODO: access the ref directly, might need to publish a `forwardRef` modal or add it to context
      const modalRef = document.querySelector(`[id^="${drawerSlug}"]`)

      if (modalRef) {
        setTimeout(() => {
          modalRef.scrollTop = 0
        }, 0)
      }

      setLoading(true)

      const newTeam: Team = {
        ...(data || {}),
        billingEmail: user?.email,
        members: [
          // add the current user as team admin
          {
            user: user?.id,
            roles: ['admin'],
          },
          ...(data?.members || [])
            ?.filter(mem => mem.email)
            .map(mem => ({
              invitedEmail: mem.email,
              roles: [mem.role],
            })),
        ],
      }

      const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      })

      const response: {
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

      closeDrawer()
      if (typeof onCreate === 'function') onCreate(newTeam)
    },
    [onCreate, user, closeDrawer, drawerSlug],
  )

  const isOpen = modalState[drawerSlug]?.isOpen

  if (!isOpen) return null

  return (
    <div className="list-drawer__content">
      {success && <p className="">Team created successfully.</p>}
      {error && (
        <div className={classes.error}>
          <p>{error?.message}</p>
        </div>
      )}
      {loading && <p className="">Creating team...</p>}
      <Form
        onSubmit={handleSubmit}
        className={classes.form}
        errors={error?.data}
        initialState={{
          name: {
            initialValue: 'My Team',
            value: 'My Team',
          },
          slug: {
            initialValue: 'my-team',
            value: 'my-team',
          },
          members: {
            initialValue: [
              {
                email: '',
                role: 'user',
              },
            ],
          },
        }}
      >
        <Text path="name" required label="Name" />
        <Text path="slug" required label="Slug" description="Slug must be unique." />
        <TeamMembers className={classes.teamMembers} />
        <Submit label="Create Team" className={classes.submit} />
      </Form>
    </div>
  )
}
