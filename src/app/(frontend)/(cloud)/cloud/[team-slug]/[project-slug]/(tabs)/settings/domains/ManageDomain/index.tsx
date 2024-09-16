import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import Link from 'next/link'

import { Button } from '@components/Button/index.js'
import { Heading } from '@components/Heading/index.js'
import { ModalWindow } from '@components/ModalWindow/index.js'
import { Accordion } from '@components/Accordion/index.js'
import { ExternalLinkIcon } from '@root/icons/ExternalLinkIcon/index.js'
import { Project, Team } from '@root/payload-cloud-types.js'

import classes from './index.module.scss'

const domainValueFieldPath = 'domain'

type Props = {
  domain: NonNullable<Project['domains']>[0]
  project: Project
  team: Team
}

export const ManageDomain: React.FC<Props> = ({ domain, project, team }) => {
  const { id, domain: domainURL, recordType, recordName, recordContent } = domain
  const modalSlug = `delete-domain-${id}`

  const { openModal, closeModal } = useModal()
  const projectID = project?.id
  const projectDomains = project?.domains
  const cnameRecord = project?.defaultDomain

  const patchDomains = React.useCallback(
    async (domains: Props['domain'][]) => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ domains }),
          },
        )

        // TODO: alert user based on status code & message

        if (req.status === 200) {
          const res = await req.json()
          // reloadProject()
          return res
        }
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
      }

      return null
    },
    [projectID],
  )

  const deleteDomain = React.useCallback(async () => {
    const remainingDomains = (projectDomains || []).filter(
      existingDomain => existingDomain.id !== id,
    )

    await patchDomains(remainingDomains)
    closeModal(modalSlug)
  }, [id, closeModal, projectDomains, patchDomains, modalSlug])

  return (
    <React.Fragment>
      <Accordion
        className={classes.domainAccordion}
        openOnInit
        label={
          <div className={classes.labelWrap}>
            <Link href={`https://${domainURL}`} target="_blank" className={classes.linkedDomain}>
              <div className={classes.domainTitleName}>{domainURL}</div>
              <ExternalLinkIcon className={classes.externalLinkIcon} />
            </Link>
          </div>
        }
      >
        <div className={classes.domainContent}>
          <p>Add the following record to your DNS provider:</p>
          <table className={classes.record}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{recordType}</td>
                <td>{recordName}</td>
                <td>{recordContent}</td>
              </tr>
            </tbody>
          </table>
          <div className={classes.domainActions}>
            <div className={classes.rightActions}>
              <Button label="Delete" appearance="danger" onClick={() => openModal(modalSlug)} />
            </div>
          </div>
        </div>
      </Accordion>
      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading marginTop={false} as="h4">
            Are you sure you want to delete this domain?
          </Heading>
          <div className={classes.modalActions}>
            <Button label="Cancel" appearance="secondary" onClick={() => closeModal(modalSlug)} />
            <Button label="Delete" appearance="danger" onClick={deleteDomain} />
          </div>
        </div>
      </ModalWindow>
    </React.Fragment>
  )
}
