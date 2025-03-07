'use client'

import type { Project } from '@root/payload-cloud-types'

import { Button } from '@components/Button/index'
import { Heading } from '@components/Heading/index'
import { ModalWindow } from '@components/ModalWindow/index'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import Submit from '@forms/Submit/index'
import { qs } from '@root/utilities/qs'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import classes from './index.module.scss'

export const deletePlanModalSlug = 'delete-project'

export type DeletePlanModalProps = {
  canManageProject: boolean
  confirmSlug: string
  environmentSlug?: string
  project: Project
}

export const DeletePlanModal: React.FC<DeletePlanModalProps> = (props) => {
  const { canManageProject, confirmSlug, environmentSlug, project } = props
  const { closeModal } = useModal()
  const [isDisabled, setIsDisabled] = React.useState(true)
  const router = useRouter()

  const deleteProject = React.useCallback(async () => {
    if (canManageProject) {
      // TODO: toast messages

      try {
        const query = qs.stringify({
          env: environmentSlug,
        })
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}${
            query ? `?${query}` : ''
          }`,
          {
            credentials: 'include',
            method: 'DELETE',
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
          <Heading as="h4" marginTop={false}>
            Are you sure you want to delete this project?
          </Heading>
          <p>
            Deleting <b>{confirmSlug}</b> cannot be undone, it is recommended to back up your
            database before continuing. You can manually add the project back to the cloud in the
            future.
          </p>
          <Text
            label={`Confirm by typing: ${confirmSlug}`}
            onChange={(value) => {
              setIsDisabled(value.toLowerCase() !== confirmSlug.toLowerCase())
            }}
            path="confirmSlug"
            required
          />
          <div className={classes.modalActions}>
            <Button
              appearance="secondary"
              label="Cancel"
              onClick={() => closeModal(deletePlanModalSlug)}
            />
            <Submit appearance="danger" disabled={isDisabled} label="Confirm" />
          </div>
        </div>
      </Form>
    </ModalWindow>
  )
}
