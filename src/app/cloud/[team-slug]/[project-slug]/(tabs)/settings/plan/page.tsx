'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { useRouter } from 'next/navigation'

import { useRouteData } from '@cloud/context'
import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { Highlight } from '@components/Highlight'
import { ModalWindow } from '@components/ModalWindow'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { Plan } from '@root/payload-cloud-types'
import { User } from '@root/payload-types'
import { useAuth } from '@root/providers/Auth'
import { isExpandedDoc } from '@root/utilities/is-expanded-doc'
import { SectionHeader } from '../_layoutComponents/SectionHeader'

import classes from './index.module.scss'

const modalSlug = 'delete-project'

type ModalContentProps = {
  confirmSlug: string
}
const ModalContent: React.FC<ModalContentProps> = ({ confirmSlug }) => {
  const { closeModal } = useModal()
  const [isDisabled, setIsDisabled] = React.useState(true)

  return (
    <div className={classes.modalContent}>
      <Heading marginTop={false} as="h5">
        Are you sure you want to delete this project?
      </Heading>
      <p>
        Deleting <b>{confirmSlug}</b> cannot be undone, it is recommended to back up your database
        before continuing. You can manually add the project back to the cloud in the future.
      </p>

      <Text
        label={`Confirm by typing: ${confirmSlug}`}
        path="confirmSlug"
        onChange={value => {
          setIsDisabled(value.toLowerCase() !== confirmSlug.toLowerCase())
        }}
      />

      <div className={classes.modalActions}>
        <Button label="cancel" appearance="secondary" onClick={() => closeModal(modalSlug)} />
        <Submit label="confirm" appearance="danger" disabled={isDisabled} />
      </div>
    </div>
  )
}

export const checkRole = (allRoles: User['roles'] = [], user: User): boolean => {
  if (user) {
    if (
      allRoles.some(role => {
        return user?.roles?.some(individualRole => {
          return individualRole === role
        })
      })
    )
      return true
  }

  return false
}

const canUserMangeProject = ({ project, user }) => {
  const isAdmin = checkRole(['admin'], user)
  if (isAdmin) return true

  const userTeams = user?.teams || []
  const isTeamOwner = userTeams.find(
    team => team.id === project.team.id && team.roles.includes('owner'),
  )

  return Boolean(isTeamOwner)
}

export default () => {
  const { project } = useRouteData()
  const router = useRouter()
  const { user } = useAuth()
  const { openModal } = useModal()

  const canManageProject = canUserMangeProject({ project, user })
  console.log({ user, project })

  const deleteProject = React.useCallback(async () => {
    if (canManageProject) {
      // TODO: toast messages

      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}`,
          {
            method: 'DELETE',
            credentials: 'include',
          },
        )

        if (req.status === 200) {
          router.push('/cloud/projects')
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [project, canManageProject, router])

  if (project?.plan && isExpandedDoc<Plan>(project.plan) && project?.slug) {
    return (
      <div className={classes.plan}>
        <SectionHeader title="Current Plan" />

        <div className={classes.borderBox}>
          <Heading className={classes.highlightHeading} element="p" as="h5" margin={false}>
            <Highlight text={project.plan.name} />
          </Heading>
          <p className={classes.downgradeText}>
            To downgrade or upgrade your plan, please{' '}
            <a href="mailto:info@payloadcms.com?subject=Downgrade/Upgrade Cloud Plan&body=Hi! I would like to change my cloud plan.">
              contact us
            </a>{' '}
            and we will change your plan for you. This is temporary until we have a self-service
            plan change feature.
          </p>
        </div>

        {canManageProject && (
          <>
            <SectionHeader className={classes.deleteHeading} title="Delete Project" />

            <div className={classes.borderBox}>
              <Heading className={classes.warningHeading} element="p" as="h5" margin={false}>
                <Highlight appearance="danger" text="Warning" />
              </Heading>

              <p className={classes.downgradeText}>
                Once you delete a project, there is no going back so please be certain. We recommend
                exporting your database before deleting.
              </p>

              <Button appearance="danger" label="Delete" onClick={() => openModal(modalSlug)} />
            </div>

            <ModalWindow slug={modalSlug}>
              <Form onSubmit={deleteProject}>
                <ModalContent confirmSlug={project.slug} />
              </Form>
            </ModalWindow>
          </>
        )}
      </div>
    )
  }

  return null
}
