import * as React from 'react'
import { Collapsible } from '@faceless-ui/collapsibles'
import { useModal } from '@faceless-ui/modal'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { Label } from '@components/Label'
import { ModalWindow } from '@components/ModalWindow'
import { Accordion } from '@dashboard/_components/Accordion'
import { useRouteData } from '@dashboard/context'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { ExternalLinkIcon } from '@root/icons/ExternalLinkIcon'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

const domainValueFieldPath = 'domain'
const modalSlug = 'delete-domain'

type Props = {
  domain: Project['domains'][0]
}
export const ManageDomain: React.FC<Props> = ({ domain }) => {
  const { id: domainID, domain: domainURL, status, records } = domain

  const { openModal, closeModal } = useModal()
  const { project, reloadProject } = useRouteData()
  const projectID = project.id
  const projectDomains = project?.domains

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
          reloadProject()
          return res
        }
      } catch (e) {
        console.error(e)
      }

      return null
    },
    [projectID, reloadProject],
  )

  const updateDomain = React.useCallback(
    async ({ data }) => {
      const newDomainValue = data[domainValueFieldPath]

      if (typeof newDomainValue === 'string' && domainID) {
        const updatedDomains = projectDomains.map(existingDomain => {
          if (existingDomain.id === domainID) {
            return {
              ...existingDomain,
              domain: newDomainValue,
            }
          }

          return existingDomain
        })

        await patchDomains(updatedDomains)
      }
    },
    [domainID, projectDomains, patchDomains],
  )

  const deleteDomain = React.useCallback(async () => {
    const remainingDomains = (projectDomains || []).filter(
      existingDomain => existingDomain.id !== domainID,
    )

    await patchDomains(remainingDomains)
    closeModal(modalSlug)
  }, [domainID, closeModal, projectDomains, patchDomains])

  return (
    <>
      <Collapsible openOnInit={status === 'pending'}>
        <Accordion
          label={
            <div className={classes.labelWrap}>
              {status === 'active' ? (
                <Link
                  href={`https://${domainURL}`}
                  target="_blank"
                  className={classes.linkedDomain}
                >
                  <div className={classes.domainTitleName}>{domainURL}</div>
                  <ExternalLinkIcon className={classes.externalLinkIcon} />
                </Link>
              ) : (
                <div className={classes.domainTitleName}>{domainURL}</div>
              )}
            </div>
          }
          toggleIcon="chevron"
          className={[classes.domain, classes[status]].join(' ')}
        >
          <Form onSubmit={updateDomain}>
            <div className={classes.domainContent}>
              <Text
                required
                label="Domain"
                className={classes.domainInput}
                path={domainValueFieldPath}
                initialValue={domainURL}
              />

              <div>
                <Label className={classes.domainRecordsTitle}>Records</Label>

                <div className={classes.domainRecords}>
                  <table className={classes.domainRecordsTable}>
                    <thead>
                      <tr>
                        <th>
                          <Label>Name</Label>
                        </th>
                        <th>
                          <Label>Type</Label>
                        </th>
                        <th>
                          <Label>Value</Label>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(records || []).map(record => (
                        <tr key={record.id} className={classes.domainRecord}>
                          <td className={classes.domainRecordName}>
                            <Label>{record.name}</Label>
                          </td>
                          <td className={classes.domainRecordType}>
                            <Label>{record.type}</Label>
                          </td>
                          <td className={classes.domainRecordValue}>
                            <Label>{record.value}</Label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={classes.domainActions}>
                <Button
                  size="small"
                  label="delete"
                  appearance="danger"
                  onClick={() => openModal(modalSlug)}
                />
                <Submit size="small" label="save" appearance="secondary" icon={false} />
              </div>
            </div>
          </Form>
        </Accordion>
      </Collapsible>

      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading marginTop={false} as="h5">
            Are you sure you want to delete this domain?
          </Heading>
          <p>
            Deleting a domain variable from a project cannot be undone. You can manually add the
            domain back to the project.
          </p>

          <div className={classes.modalActions}>
            <Button label="cancel" appearance="secondary" onClick={() => closeModal(modalSlug)} />
            <Button label="delete" appearance="danger" onClick={deleteDomain} />
          </div>
        </div>
      </ModalWindow>
    </>
  )
}
