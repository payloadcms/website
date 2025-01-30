import type { ButtonProps } from '@components/Button/index.js'
import type { Project, Team } from '@root/payload-cloud-types.js'

import { Accordion } from '@components/Accordion/index.js'
import { Button } from '@components/Button/index.js'
import { CopyToClipboard } from '@components/CopyToClipboard/index.js'
import { Heading } from '@components/Heading/index.js'
import { ModalWindow } from '@components/ModalWindow/index.js'
import { useModal } from '@faceless-ui/modal'
import { Secret } from '@forms/fields/Secret/index.js'
import { ExternalLinkIcon } from '@root/icons/ExternalLinkIcon/index.js'
import { qs } from '@root/utilities/qs.js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { toast } from 'sonner'

import classes from './index.module.scss'

const domainValueFieldPath = 'domain'

type Props = {
  emailDomain: NonNullable<Project['customEmailDomains']>[0]
  environmentSlug: string
  project: Project
  team: Team
}

type VerificationStatus = 'not_started' | 'pending' | 'verified'

export const ManageEmailDomain: React.FC<Props> = ({
  emailDomain,
  environmentSlug,
  project,
  team,
}) => {
  const { id, customDomainResendDNSRecords, domain: domainURL, resendDomainID } = emailDomain
  const modalSlug = `delete-emailDomain-${id}`

  const { closeModal, openModal } = useModal()
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('not_started')
  const projectID = project?.id
  const projectEmailDomains = project?.customEmailDomains
  const hasInitialized = useRef(false)
  const router = useRouter()

  const getDomainVerificationStatus = useCallback(
    async (domainId: string) => {
      const query = qs.stringify({
        domainId,
        env: environmentSlug,
      })
      const { status } = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/email-verification${
          query ? `?${query}` : ''
        }`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then((res) => res.json())
      setVerificationStatus(status)
    },
    [project?.id],
  )

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      if (resendDomainID) {
        getDomainVerificationStatus(resendDomainID)
      }
    }
  }, [getDomainVerificationStatus, resendDomainID])

  const loadCustomDomainEmailAPIKey = useCallback(
    async (domainId: string) => {
      const query = qs.stringify({
        domainId,
        env: environmentSlug,
      })
      const { value } = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/email-api-key${
          query ? `?${query}` : ''
        }`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then((res) => res.json())

      return value
    },
    [project?.id],
  )

  const patchEmailDomains = useCallback(
    async (emailDomains: Props['emailDomain'][]) => {
      try {
        const query = qs.stringify({
          env: environmentSlug,
        })
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}${
            query ? `?${query}` : ''
          }`,
          {
            body: JSON.stringify({ customEmailDomains: emailDomains }),
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
          return res
        }
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
      }

      return null
    },
    [projectID],
  )

  const verifyEmailDomain = useCallback(
    async (domainId: string) => {
      try {
        const query = qs.stringify({
          domainId,
          env: environmentSlug,
        })
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectID}/verify-email-domain${
            query ? `?${query}` : ''
          }`,
          {
            body: JSON.stringify({ domain: domainURL }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
        )

        if (req.status === 200) {
          const res = await req.json()
          router.refresh()
          toast.success(res.message)
        }
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
      }
    },
    [domainURL, projectID],
  )

  const deleteEmailDomain = useCallback(async () => {
    const remainingDomains = (projectEmailDomains || []).filter(
      (existingDomain) => existingDomain.id !== id,
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

  const verificationStatusColor = (status: VerificationStatus): ButtonProps['appearance'] => {
    switch (status) {
      case 'not_started':
        return 'secondary'
      case 'pending':
        return 'warning'
      case 'verified':
        return 'success'
      default:
        return 'secondary'
    }
  }

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
          <div className={classes.domainInfo}>
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
                  ({ name, type, priority, value }, index: number) => (
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
              appearance={verificationStatusColor(verificationStatus)}
              label={formatVerificationStatus(verificationStatus)}
              onClick={() => verifyEmailDomain(emailDomain.resendDomainID as string)}
            />
          </div>
          <div className={classes.rightActions}>
            <Button appearance="danger" label="Delete" onClick={() => openModal(modalSlug)} />
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
            <Button appearance="danger" label="Delete" onClick={deleteEmailDomain} />
          </div>
        </div>
      </ModalWindow>
    </React.Fragment>
  )
}
