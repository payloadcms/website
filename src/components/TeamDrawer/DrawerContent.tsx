import React, { useCallback } from 'react'
import { useModal } from '@faceless-ui/modal'
import { ArrayProvider } from '@forms/fields/Array/context'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { useRouter } from 'next/navigation'

import { BorderBox } from '@root/app/_components/BorderBox'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { TeamInvites } from './TeamInvites'
import { TeamDrawerProps } from './types'

import classes from './DrawerContent.module.scss'

export const TeamDrawerContent: React.FC<TeamDrawerProps> = ({
  drawerSlug,
  onCreate,
  redirectAfterCreate,
  closeDrawer,
}) => {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const [error, setError] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
  }>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)

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

        setLoading(true)

        const newTeam: Team = {
          ...(unflattenedData || {}),
          billingEmail: user?.email,
          members: [
            // add the current user as team admin
            {
              user: user?.id,
              roles: ['admin'],
            },
            ...(unflattenedData?.members || [])
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

        setUser({
          ...user,
          teams: [
            ...(user?.teams || []),
            {
              team: response?.doc,
              // roles: TODO: add the user's roles within this team
            },
          ],
        })

        if (typeof onCreate === 'function') onCreate(response?.doc)

        if (redirectAfterCreate) router.push(`/cloud/${response?.doc?.slug}`)
        else {
          closeDrawer()
        }
      }
    },
    [onCreate, user, drawerSlug, setUser, router, closeDrawer, redirectAfterCreate],
  )

  const isOpen = modalState[drawerSlug]?.isOpen

  if (!isOpen) return null

  return (
    <ArrayProvider>
      <BorderBox>
        <div className="list-drawer__content">
          {success && <p className="">Team created successfully, now redirecting...</p>}
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
            <TeamInvites className={classes.teamInvites} />
            <div>
              <Submit label="Create Team" className={classes.submit} />
            </div>
          </Form>
        </div>
      </BorderBox>
    </ArrayProvider>
  )
}
