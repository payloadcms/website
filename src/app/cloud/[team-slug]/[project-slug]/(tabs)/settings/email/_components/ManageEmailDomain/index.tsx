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
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'
import { CopyToClipboard } from '@components/CopyToClipboard'

const domainValueFieldPath = 'domain'

type Props = {
  emailDomain: NonNullable<Project['customEmailDomains']>[0]
}

export const ManageEmailDomain: React.FC<Props> = ({ emailDomain }) => {
  const { id, domain: domainURL, customDomainResendDNSRecords } = emailDomain
  const modalSlug = `delete-emailDomain-${id}`

  const { openModal, closeModal } = useModal()
  const { project, reloadProject } = useRouteData()
  const projectID = project?.id
  const projectEmailDomains = project?.customEmailDomains

  const patchEmailDomains = React.useCallback(
    async (emailDomains: Props['emailDomain'][]) => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customEmailDomains: emailDomains }),
          },
        )

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

  const updateEmailDomain = React.useCallback(
    async ({ data }) => {
      const newEmailDomainValue = data[domainValueFieldPath]

      if (typeof newEmailDomainValue === 'string' && id) {
        const updatedDomains = (projectEmailDomains || []).map(exisistingDomain => {
          if (exisistingDomain.id === id) {
            return {
              ...exisistingDomain,
              domain: newEmailDomainValue,
            }
          }

          return exisistingDomain
        })

        await patchEmailDomains(updatedDomains)
      }
    },
    [id, projectEmailDomains, patchEmailDomains],
  )

  const deleteEmailDomain = React.useCallback(async () => {
    const remainingDomains = (projectEmailDomains || []).filter(
      exisistingDomain => exisistingDomain.id !== id,
    )

    await patchEmailDomains(remainingDomains)
  }, [id, projectEmailDomains, patchEmailDomains])

  return (
    <>
      <Collapsible openOnInit>
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
          <Form onSubmit={updateEmailDomain}>
            <div className={classes.domainContent}>
              <Text
                required
                label="Domain"
                className={classes.domainInput}
                path={domainValueFieldPath}
                initialValue={domainURL}
                validate={validateDomain}
              />

              <p>Add the following records to your DNS provider:</p>
              <table className={classes.record}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Host/Selector</th>
                    <th>Value</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {customDomainResendDNSRecords &&
                    customDomainResendDNSRecords.map(
                      (
                        { recordType, recordName, recordContent, recordPriority },
                        index: number,
                      ) => (
                        <tr key={index}>
                          <td>{recordType}</td>
                          <td>
                            <CopyToClipboard value={recordName} />
                            {recordName}
                          </td>
                          <td>
                            <CopyToClipboard value={recordContent} />
                            {recordContent}
                          </td>
                          {recordPriority && <td>{recordPriority}</td>}
                        </tr>
                      ),
                    )}
                </tbody>
              </table>

              <div className={classes.domainActions}>
                <div className={classes.rightActions}>
                  <Button label="delete" appearance="danger" onClick={() => openModal(modalSlug)} />
                  <Submit label="save" appearance="secondary" icon={false} />
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
          <div className={classes.modalActions}>
            <Button label="cancel" appearance="secondary" onClick={() => closeModal(modalSlug)} />
            <Button label="delete" appearance="danger" onClick={deleteEmailDomain} />
          </div>
        </div>
      </ModalWindow>
    </>
  )
}
