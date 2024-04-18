'use client'

import React from 'react'
import { toast } from 'react-toastify'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { ModalWindow } from '@components/ModalWindow'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const deletePlanModalSlug = 'delete-project'

export type DeletePlanModalProps = {
  confirmSlug: string
  canManageProject: boolean
  project: Project
}

export const DeletePlanModal: React.FC<DeletePlanModalProps> = props => {
  const { confirmSlug, canManageProject, project } = props
  const { closeModal } = useModal()
  const [isDisabled, setIsDisabled] = React.useState(true)
  const router = useRouter()

  const deleteProject = React.useCallback(async () => {
    if (canManageProject) {
      // TODO: toast messages

      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}`,
          {
            method: 'DELETE',
            credentials: 'include',
          },
        )

        if (req.status === 200) {
          router.push('/cloud')
          toast.success('Project was deleted successfully.')
        }
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
      }
    }
  }, [project, canManageProject, router])

  return (
    <ModalWindow slug={deletePlanModalSlug}>
      <Form onSubmit={deleteProject}>
        <div className={classes.modalContent}>
          <Heading marginTop={false} as="h4">
            Are you sure you want to delete this project?
          </Heading>
          <p>
            Deleting <b>{confirmSlug}</b> cannot be undone, it is recommended to back up your
            database before continuing. You can manually add the project back to the cloud in the
            future.
          </p>
          <Text
            label={`Confirm by typing: ${confirmSlug}`}
            path="confirmSlug"
            onChange={value => {
              setIsDisabled(value.toLowerCase() !== confirmSlug.toLowerCase())
            }}
            required
          />
          <div className={classes.modalActions}>
            <Button
              label="Cancel"
              appearance="secondary"
              onClick={() => closeModal(deletePlanModalSlug)}
            />
            <Submit label="Confirm" appearance="danger" disabled={isDisabled} />
          </div>
        </div>
      </Form>
    </ModalWindow>
  )
}
