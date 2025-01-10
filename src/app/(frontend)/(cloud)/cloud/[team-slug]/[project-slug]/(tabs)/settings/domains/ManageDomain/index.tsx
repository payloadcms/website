import type { Project, Team } from '@root/payload-cloud-types.js'

import { Accordion } from '@components/Accordion/index.js'
import { Button } from '@components/Button/index.js'
import { CopyToClipboard } from '@components/CopyToClipboard'
import { Heading } from '@components/Heading/index.js'
import { ModalWindow } from '@components/ModalWindow/index.js'
import { useModal } from '@faceless-ui/modal'
import { ExternalLinkIcon } from '@root/icons/ExternalLinkIcon/index.js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import classes from './index.module.scss'

const domainValueFieldPath = 'domain'

type Props = {
  domain: NonNullable<Project['domains']>[0]
  environmentSlug: string
  project: Project
  team: Team
}

export const ManageDomain: React.FC<Props> = ({ domain, environmentSlug, project, team }) => {
  const { id, domain: domainURL, recordContent, recordName, recordType } = domain
  const modalSlug = `delete-domain-${id}`
  const router = useRouter()

  const { closeModal, openModal } = useModal()
  const projectID = project?.id
  const [projectDomains, setProjectDomains] = React.useState(project?.domains || [])

  const patchDomains = React.useCallback(
    async (domains: Props['domain'][]) => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}${
            environmentSlug ? `?env=${environmentSlug}` : ''
          }`,
          {
            body: JSON.stringify({ domains }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
          },
        )

        if (req.status === 200) {
          const res = await req.json()
          router.refresh()
          setProjectDomains(domains)
          return res
        }
      } catch (e) {
        console.error(e)
      }

      return null
    },
    [projectID, environmentSlug],
  )

  const deleteDomain = React.useCallback(async () => {
    const remainingDomains = (projectDomains || []).filter(
      (existingDomain) => existingDomain.id !== id,
    )

    await patchDomains(remainingDomains)
    closeModal(modalSlug)
  }, [id, closeModal, projectDomains, patchDomains, modalSlug])

  return (
    <React.Fragment>
      <Accordion
        className={classes.domainAccordion}
        label={
          <div className={classes.labelWrap}>
            <Link className={classes.linkedDomain} href={`https://${domainURL}`} target="_blank">
              <div className={classes.domainTitleName}>{domainURL}</div>
              <ExternalLinkIcon className={classes.externalLinkIcon} />
            </Link>
          </div>
        }
        openOnInit
      >
        <div className={classes.domainContent}>
          <p>Add the following record to your DNS provider:</p>
          <div className={classes.tableContainer}>
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
                  <td>
                    <span>
                      {recordName}
                      {recordName && <CopyToClipboard value={recordName} />}
                    </span>
                  </td>
                  <td>
                    <span>
                      {recordContent}
                      {recordContent && <CopyToClipboard value={recordContent} />}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={classes.domainActions}>
            <div className={classes.rightActions}>
              <Button appearance="danger" label="Delete" onClick={() => openModal(modalSlug)} />
            </div>
          </div>
        </div>
      </Accordion>
      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading as="h4" marginTop={false}>
            Are you sure you want to delete this domain?
          </Heading>
          <div className={classes.modalActions}>
            <Button appearance="secondary" label="Cancel" onClick={() => closeModal(modalSlug)} />
            <Button appearance="danger" label="Delete" onClick={deleteDomain} />
          </div>
        </div>
      </ModalWindow>
    </React.Fragment>
  )
}
