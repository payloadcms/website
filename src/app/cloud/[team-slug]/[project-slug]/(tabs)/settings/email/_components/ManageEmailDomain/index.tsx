import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Collapsible } from '@faceless-ui/collapsibles'
import { useModal } from '@faceless-ui/modal'
import { Secret } from '@forms/fields/Secret'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { validateDomain } from '@forms/validations'
import Link from 'next/link'

import { Button } from '@components/Button'
import { CopyToClipboard } from '@components/CopyToClipboard'
import { Heading } from '@components/Heading'
import { ModalWindow } from '@components/ModalWindow'
import { Accordion } from '@root/app/cloud/_components/Accordion'
import { useRouteData } from '@root/app/cloud/context'
import { ExternalLinkIcon } from '@root/icons/ExternalLinkIcon'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

const domainValueFieldPath = 'domain'

type Props = {
  emailDomain: NonNullable<Project['customEmailDomains']>[0]
}

type VerificationStatus = 'not_started' | 'pending' | 'verified'

export const ManageEmailDomain: React.FC<Props> = ({ emailDomain }) => {
  const { id, domain: domainURL, customDomainResendDNSRecords, resendDomainID } = emailDomain
  const modalSlug = `delete-emailDomain-${id}`

  const { openModal, closeModal } = useModal()
  const { project, reloadProject } = useRouteData()
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('not_started')
  const projectID = project?.id
  const projectEmailDomains = project?.customEmailDomains
  const hasInitialized = useRef(false)

  const getDomainVerificationStatus = useCallback(
    async (domainId: string) => {
      console.log('verificationStatus', verificationStatus)
      const { status } = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/email-verification?domainId=${domainId}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then(res => res.json())
      console.log('received status from payload api', status)
      setVerificationStatus(status)
    },
    [project?.id, verificationStatus],
  )

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      if (resendDomainID) getDomainVerificationStatus(resendDomainID)
    }
  }, [getDomainVerificationStatus, resendDomainID])

  const loadCustomDomainEmailAPIKey = useCallback(
    async (domainId: string) => {
      const { value } = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/email-api-key?domainId=${domainId}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then(res => res.json())

      return value
    },
    [project?.id],
  )

  const patchEmailDomains = useCallback(
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

  const updateEmailDomain = useCallback(
    async ({ data }) => {
      const newEmailDomainValue = data[domainValueFieldPath]

      if (typeof newEmailDomainValue === 'string' && id) {
        const updatedDomains = (projectEmailDomains || []).map(existingDomain => {
          if (existingDomain.id === id) {
            return {
              ...existingDomain,
              domain: newEmailDomainValue,
            }
          }

          return existingDomain
        })

        await patchEmailDomains(updatedDomains)
      }
    },
    [id, projectEmailDomains, patchEmailDomains],
  )

  const verifyEmailDomain = useCallback(
    async (domainId: string) => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/verify-email-domain?domainId=${domainId}`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ domain: domainURL }),
          },
        )

        if (req.status === 200) {
          const res = await req.json()
          reloadProject()
          toast.success(res.message)
        }
      } catch (e) {
        console.error(e)
      }
    },
    [domainURL, projectID, reloadProject],
  )

  const deleteEmailDomain = useCallback(async () => {
    const remainingDomains = (projectEmailDomains || []).filter(
      existingDomain => existingDomain.id !== id,
    )

    await patchEmailDomains(remainingDomains)
  }, [id, projectEmailDomains, patchEmailDomains])

  const formatVerificationStatus = (status: VerificationStatus) => {
    switch (status) {
      case 'not_started':
        return 'Verify'
      case 'pending':
        return 'Pending'
      case 'verified':
        return 'Verified'
      default:
        return 'Verify'
    }
  }

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
              <div className={classes.domainInfo}>
                {!emailDomain.resendDomainID && (
                  <Text
                    required
                    label="Domain"
                    className={classes.domainInput}
                    path={domainValueFieldPath}
                    initialValue={domainURL}
                    validate={validateDomain}
                    readOnly={Boolean(emailDomain.resendDomainID)}
                  />
                )}
                {(emailDomain.resendAPIKey && typeof emailDomain.resendDomainID === 'string') ?? (
                  <Secret
                    label="Resend API Key"
                    loadSecret={() =>
                      loadCustomDomainEmailAPIKey(
                        typeof emailDomain.resendDomainID === 'string'
                          ? emailDomain.resendDomainID
                          : '',
                      )
                    }
                    readOnly
                  />
                )}
                {emailDomain.resendDomainID && verificationStatus !== 'verified' && (
                  <p>
                    To use your custom domain, add the following records to your DNS provider. Once
                    added, click verify to confirm your domain settings with Resend.
                  </p>
                )}
              </div>
              <table className={classes.records}>
                <thead>
                  <tr>
                    <th className={classes.recordType}>Type</th>
                    <th className={classes.recordName}>Host/Selector</th>
                    <th className={classes.recordContent}>Value</th>
                    <th className={classes.recordPriority}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {customDomainResendDNSRecords &&
                    customDomainResendDNSRecords.map(
                      ({ name, type, value, priority }, index: number) => (
                        <tr key={index}>
                          <td className={classes.recordType}>
                            <span>{type}</span>
                          </td>
                          <td className={classes.recordName}>
                            <CopyToClipboard value={name} />
                            <span>{name}</span>
                          </td>
                          <td className={classes.recordContent}>
                            <CopyToClipboard value={value} />
                            <span>{value}</span>
                          </td>
                          {priority && (
                            <td className={classes.recordPriority}>
                              <span>{priority}</span>
                            </td>
                          )}
                        </tr>
                      ),
                    )}
                </tbody>
              </table>
            </div>
            <div className={classes.domainActions}>
              <div className={classes.leftActions}>
                <Button
                  label={formatVerificationStatus(verificationStatus)}
                  appearance={
                    verificationStatus === 'not_started'
                      ? 'success'
                      : verificationStatus === 'pending'
                      ? 'warning'
                      : 'secondary'
                  }
                  onClick={() => verifyEmailDomain(emailDomain.resendDomainID as string)}
                />
              </div>
              <div className={classes.rightActions}>
                <Button label="delete" appearance="danger" onClick={() => openModal(modalSlug)} />
                {!Boolean(emailDomain.resendDomainID) && (
                  <Submit label="save" appearance="secondary" icon={false} />
                )}
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
