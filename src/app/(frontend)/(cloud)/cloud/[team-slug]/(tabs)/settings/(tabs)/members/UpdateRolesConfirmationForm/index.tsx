import type { Member } from '@cloud/_components/TeamMembers/index'
import type { Team, User } from '@root/payload-cloud-types'

import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { Button } from '@components/Button/index'
import { Heading } from '@components/Heading/index'
import { useModal } from '@faceless-ui/modal'
import Form from '@forms/Form/index'
import Submit from '@forms/Submit/index'
import React from 'react'
import { toast } from 'sonner'

import classes from './page.module.scss'

interface UpdateRolesConfirmationFormProps {
  memberIndex: null | number
  modalSlug: string
  newRoles: ('admin' | 'owner' | 'user')[] | null
  onRolesUpdated: (newRoles: ('admin' | 'owner' | 'user')[]) => void
  originalRoles: ('admin' | 'owner' | 'user')[][]
  selectedMember: Member
  setRoles: any
  team: Team
  user: User
}

export const UpdateRolesConfirmationForm: React.FC<UpdateRolesConfirmationFormProps> = ({
  memberIndex,
  modalSlug,
  newRoles,
  onRolesUpdated,
  originalRoles,
  selectedMember,
  setRoles,
  team,
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
        body: JSON.stringify({
          roles: newRoles,
          teamID: team.id,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
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
      <Heading as="h4" marginTop={false}>
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
        <Button appearance="secondary" label="Cancel" onClick={handleCancel} />
        <Submit appearance="primary" label="Confirm" />
      </div>
    </Form>
  )
}
