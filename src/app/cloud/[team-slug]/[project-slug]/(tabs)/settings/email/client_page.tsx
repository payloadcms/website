'use client'

import * as React from 'react'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'
import { Secret } from '@forms/fields/Secret'
import { Text } from '@forms/fields/Text'

import { Banner } from '@components/Banner'
import Code from '@components/Code'
import { Accordion } from '@root/app/_components/Accordion'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { Divider } from '@root/app/cloud/_components/SectionDivider'
import { useRouteData } from '@root/app/cloud/context'
import { Plan, Team } from '@root/payload-cloud-types'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddEmailDomain } from './_components/AddEmailDomain'
import { ManageEmailDomain } from './_components/ManageEmailDomain'

export const ProjectEmailPage = () => {
  const { project } = useRouteData()
  const teamSlug = (project?.team as Team).slug
  const projectPlan = (project?.plan as Plan).slug

  const supportsCustomEmail = projectPlan !== 'standard'

  const loadEmailAPIKey = React.useCallback(async () => {
    const { value } = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/email-api-key`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(res => res.json())

    return value
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
        for you to take advantage of Resend’s platform. By default, Payload will send email from
        your default domain:{' '}
        <a href={`https://${project?.defaultDomain}`} target="_blank">
          {project?.defaultDomain}
        </a>
      </p>
      {project?.resendDomainID ? (
        <Secret label="Resend API Key" loadSecret={loadEmailAPIKey} readOnly />
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
      <SectionHeader title="Custom Email Domains" />
      {!supportsCustomEmail ? (
        <Banner type="error">
          <p>
            Custom email domains are not supported on the Standard Plan. To use this feature,{' '}
            <a href={`/cloud/${teamSlug}/${project?.slug}/settings/plan`}>upgrade your plan.</a>
          </p>
        </Banner>
      ) : (
        <React.Fragment>
          <CollapsibleGroup transTime={250} transCurve="ease">
            <Accordion openOnInit label="Add New Email Domain">
              <AddEmailDomain />
            </Accordion>
          </CollapsibleGroup>

          {project?.customEmailDomains && project.customEmailDomains.length > 0 ? (
            <React.Fragment>
              <Divider />
              <SectionHeader title="Manage Email Domains" />
              <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
                <div>
                  {project.customEmailDomains.map(emailDomain => (
                    <ManageEmailDomain key={emailDomain.id} emailDomain={emailDomain} />
                  ))}
                </div>
              </CollapsibleGroup>
            </React.Fragment>
          ) : (
            <NoData message="This project currently has no custom email domains configured." />
          )}
        </React.Fragment>
      )}
    </MaxWidth>
  )
}
