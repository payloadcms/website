import React from 'react'
import { toast } from 'sonner'
import { revalidateCache } from '@cloud/_actions/revalidateCache.js'
import { Member } from '@cloud/_components/TeamMembers/index.js'
import { useModal } from '@faceless-ui/modal'
import Form from '@forms/Form/index.js'
import Submit from '@forms/Submit/index.js'

import { Button } from '@components/Button/index.js'
import { Heading } from '@components/Heading/index.js'
import { Team, User } from '@root/payload-cloud-types.js'

import classes from './page.module.scss'

interface UpdateRolesConfirmationFormProps {
  modalSlug: string
  user: User
  team: Team
  memberIndex: number | null
  newRoles: ('owner' | 'admin' | 'user')[] | null
  selectedMember: Member
  setRoles: any
  onRolesUpdated: (newRoles: ('owner' | 'admin' | 'user')[]) => void
  originalRoles: ('owner' | 'admin' | 'user')[][]
}

export const UpdateRolesConfirmationForm: React.FC<UpdateRolesConfirmationFormProps> = ({
  modalSlug,
  team,
  memberIndex,
  newRoles,
  selectedMember,
  setRoles,
  onRolesUpdated,
  originalRoles,
}) => {
  const { closeModal } = useModal()

  const userEmail =
    selectedMember && selectedMember.user
      ? typeof selectedMember.user === 'string'
        ? selectedMember.user
        : selectedMember.user.email
      : ''

  const userName =
    selectedMember && selectedMember.user
      ? typeof selectedMember.user === 'string'
        ? selectedMember.user
        : selectedMember.user.name
      : ''

  const userID =
    selectedMember && selectedMember.user
      ? typeof selectedMember.user === 'string'
        ? selectedMember.user
        : selectedMember.user.id
      : ''

  const confirmUpdateRoles = async () => {
    if (memberIndex === null || newRoles === null) {
      toast.error('An error occurred. Please try again.')
      closeModal(modalSlug)
      return
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/${userID}/change-team-roles`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamID: team.id,
          roles: newRoles,
        }),
      },
    )

    const response = await req.json()

    if (!req.ok) {
      const message = response.message || response?.errors?.[0]?.message
      toast.error(`Failed to update roles: ${message}`)
      closeModal(modalSlug)
      return
    }

    onRolesUpdated(newRoles)

    revalidateCache({
      tag: `team_${team.id}`,
    })

    toast.success('Roles updated successfully.')
    closeModal(modalSlug)
  }

  const handleCancel = () => {
    setRoles(originalRoles)
    closeModal(modalSlug)
  }

  return (
    <Form onSubmit={confirmUpdateRoles}>
      <Heading marginTop={false} as="h4">
        Are you sure you want to update the member roles of <b>{userName ? userName : userEmail}</b>
        ?
      </Heading>
      {newRoles && (
        <p>
          You are about to change the roles to{' '}
          <b>{newRoles.length === 1 ? newRoles[0] : newRoles.slice(0, -1).join(', ')}</b>
          {newRoles.length > 1 && ' and '}
          {newRoles.length > 1 && <b>{newRoles[newRoles.length - 1]}</b>}.
        </p>
      )}
      <div className={classes.modalActions}>
        <Button label="Cancel" appearance="secondary" onClick={handleCancel} />
        <Submit label="Confirm" appearance="primary" />
      </div>
    </Form>
  )
}
