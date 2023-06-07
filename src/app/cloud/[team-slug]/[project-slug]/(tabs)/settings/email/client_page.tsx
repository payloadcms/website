'use client'

import * as React from 'react'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'

import { MaxWidth } from '@root/app/_components/MaxWidth'
import { Accordion } from '@root/app/cloud/_components/Accordion'
import { Divider } from '@root/app/cloud/_components/SectionDivider'
import { useRouteData } from '@root/app/cloud/context'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddEmailDomain } from './_components/AddEmailDomain'
import { ManageEmailDomain } from './_components/ManageEmailDomain'
import { Secret } from '@forms/fields/Secret'
import { Text } from '@forms/fields/Text'
import Code from '@components/Code'

export const ProjectEmailPage = () => {
  const { project } = useRouteData()

  const ResendAPIKey = React.useCallback(async () => {
    const value = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const res = await value.json()

    return res.resendAPIKey
  }, [project?.id])

  return (
    <MaxWidth>
      <SectionHeader title="Email Delivery" />
      <p>
        Payload Cloud utilizes{' '}
        <a href="https://resend.com" target="_blank">
          Resend
        </a>{' '}
        to provide you with email functionality out of the box. Every project comes with an API key
        for you to take advantage of Resend’s platform.
      </p>
      {project?.resendAPIKey ? (
        <Secret label="Resend API Key" loadSecret={ResendAPIKey} />
      ) : (
        <Text label="Resend API Key" disabled placeholder="Resend API key not found" />
      )}
      <p></p>
      <p>
        To use Resend’s email delivery in your Payload Cloud project, add the Payload Cloud plugin
        to your project:
      </p>
      <Code>{`yarn add @payloadcms/plugin-cloud
      `}</Code>
      <p></p>
      <p>
        <code>payload.config.js</code>:
      </p>
      <Code>{`import { payloadCloud } from '@payloadcms/plugin-cloud'
import { buildConfig } from 'payload/config'

export default buildConfig({
  plugins: [payloadCloud()]
  // rest of config
})
      `}</Code>
      <Divider />
      <SectionHeader
        title="Custom Email Domains"
        intro={
          <>
            {project?.defaultDomain && (
              <p>
                <strong>Default domain: </strong>
                <a href={`https://${project.defaultDomain}`} target="_blank">
                  {project.defaultDomain}
                </a>
              </p>
            )}
            <p></p>
          </>
        }
      />
      <CollapsibleGroup transTime={250} transCurve="ease">
        <Collapsible openOnInit>
          <Accordion label="New Email Domain" toggleIcon="chevron">
            <AddEmailDomain />
          </Accordion>
        </Collapsible>
      </CollapsibleGroup>
      <Divider />
      {project?.customEmailDomains && project.customEmailDomains.length > 0 ? (
        <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
          <div>
            {project.customEmailDomains.map(emailDomain => (
              <ManageEmailDomain key={emailDomain.id} emailDomain={emailDomain} />
            ))}
          </div>
        </CollapsibleGroup>
      ) : (
        <NoData message="This project currently has no custom email domains configured." />
      )}
    </MaxWidth>
  )
}
