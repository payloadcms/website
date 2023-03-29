import * as React from 'react'
import { Collapsible } from '@faceless-ui/collapsibles'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { validateDomain } from '@forms/validations'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { ModalWindow } from '@components/ModalWindow'
import { Accordion } from '@root/app/cloud/_components/Accordion'
import { useRouteData } from '@root/app/cloud/context'
import { ExternalLinkIcon } from '@root/icons/ExternalLinkIcon'

// import { Project } from '@root/payload-cloud-types'
import classes from './index.module.scss'

const domainValueFieldPath = 'domain'

type Props = {
  // Project.domains[0] -> not working because the array is not required
  domain: {
    domain: string
    cloudflareID?: string
    id?: string
  }
  cnameRecord?: string
}
export const ManageDomain: React.FC<Props> = ({ domain, cnameRecord }) => {
  const { id, domain: domainURL } = domain
  const modalSlug = `delete-domain-${id}`

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
        console.error(e) // eslint-disable-line no-console
      }

      return null
    },
    [projectID, reloadProject],
  )

  const updateDomain = React.useCallback(
    async ({ data }) => {
      const newDomainValue = data[domainValueFieldPath]

      if (typeof newDomainValue === 'string' && id) {
        const updatedDomains = (projectDomains || []).map(existingDomain => {
          if (existingDomain.id === id) {
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
    [id, projectDomains, patchDomains],
  )

  const deleteDomain = React.useCallback(async () => {
    const remainingDomains = (projectDomains || []).filter(
      existingDomain => existingDomain.id !== id,
    )

    await patchDomains(remainingDomains)
    closeModal(modalSlug)
  }, [id, closeModal, projectDomains, patchDomains, modalSlug])

  return (
    <>
      <Collapsible openOnInit={false}>
        <Accordion
          className={classes.domainAccordion}
          toggleIcon="chevron"
          label={
            <div className={classes.labelWrap}>
              <Link href={`https://${domainURL}`} target="_blank" className={classes.linkedDomain}>
                <div className={classes.domainTitleName}>{domainURL}</div>
                <ExternalLinkIcon className={classes.externalLinkIcon} />
              </Link>
            </div>
          }
        >
          <Form onSubmit={updateDomain}>
            <div className={classes.domainContent}>
              <Text
                required
                label="Domain"
                className={classes.domainInput}
                path={domainValueFieldPath}
                initialValue={domainURL}
                validate={validateDomain}
              />

              <div className={classes.pendingDomain}>
                <div className={classes.configureDomain}>
                  <div className={classes.domainRecords}>
                    <table className={classes.domainRecordsTable}>
                      <thead>
                        <tr>
                          <th>Record Type</th>
                          <th>Record Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={classes.domainRecord}>
                          <td className={classes.domainRecordName}>
                            <p>CNAME</p>
                          </td>
                          <td className={classes.domainRecordValue}>{cnameRecord}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className={classes.pendingDomainAlert}>
                  You will need to configure this record with your DNS provider.
                </p>
              </div>

              <div className={classes.domainActions}>
                {/* {status === 'pending' && (
                  <div className={classes.leftActions}>
                    <Button label="refresh" appearance="secondary" size="small" />
                  </div>
                )} */}

                <div className={classes.rightActions}>
                  <Button
                    size="small"
                    label="delete"
                    appearance="danger"
                    onClick={() => openModal(modalSlug)}
                  />
                  <Submit size="small" label="save" appearance="secondary" icon={false} />
                </div>
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
            Deleting a domain from a project cannot be undone. You can manually add the domain back
            to the project.
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
