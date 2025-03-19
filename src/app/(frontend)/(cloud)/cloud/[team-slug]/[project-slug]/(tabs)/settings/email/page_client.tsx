'use client'

import type { Plan, Project, Team } from '@root/payload-cloud-types'

import { cloudSlug } from '@cloud/slug'
import { Accordion } from '@components/Accordion/index'
import { Banner } from '@components/Banner/index'
import Code from '@components/Code/index'
import { HR } from '@components/HR/index'
import { MaxWidth } from '@components/MaxWidth/index'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'
import { Secret } from '@forms/fields/Secret/index'
import { Text } from '@forms/fields/Text/index'
import * as React from 'react'

import { NoData } from '../_layoutComponents/NoData/index'
import { SectionHeader } from '../_layoutComponents/SectionHeader/index'
import { AddEmailDomain } from './AddEmailDomain/index'
import { ManageEmailDomain } from './ManageEmailDomain/index'

export const ProjectEmailPage: React.FC<{
  environmentSlug: string
  project: Project
  team: Team
}> = ({ environmentSlug, project, team }) => {
  const teamSlug = team?.slug
  const projectPlan = (project?.plan as Plan)?.slug

  const supportsCustomEmail = projectPlan !== 'standard'

  const loadEmailAPIKey = React.useCallback(async () => {
    const { value } = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/email-api-key${
        environmentSlug ? `?env=${environmentSlug}` : ''
      }`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => res.json())

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
        <Text disabled label="Resend API Key" placeholder="Resend API key not found" />
      )}
      <p></p>
      <p>
        To use Resend’s email delivery in your Payload Cloud project, add the Payload Cloud plugin
        to your project:
      </p>
      <Code disableMinHeight showLineNumbers={false}>{`pnpm add @payloadcms/payload-cloud`}</Code>
      <p></p>
      <p>
        <code>payload.config.js</code>:
      </p>
      <Code
        disableMinHeight
        showLineNumbers={false}
      >{`import { payloadCloud } from '@payloadcms/payload-cloud'
import { buildConfig } from 'payload/config'

export default buildConfig({
  plugins: [payloadCloud()]
  // rest of config
})`}</Code>
      <HR />
      <SectionHeader title="Custom Email Domains" />
      {!supportsCustomEmail ? (
        <Banner type="error">
          <p>
            Custom email domains are not supported on the Standard Plan. To use this feature,{' '}
            <a href={`/${cloudSlug}/${teamSlug}/${project?.slug}/settings/plan`}>
              upgrade your plan.
            </a>
          </p>
        </Banner>
      ) : (
        <React.Fragment>
          <CollapsibleGroup transCurve="ease" transTime={250}>
            <Accordion label="Add New Email Domain" openOnInit>
              <AddEmailDomain environmentSlug={environmentSlug} project={project} />
            </Accordion>
          </CollapsibleGroup>

          {project?.customEmailDomains && project.customEmailDomains.length > 0 ? (
            <React.Fragment>
              <HR />
              <SectionHeader title="Manage Email Domains" />
              <CollapsibleGroup allowMultiple transCurve="ease" transTime={250}>
                <div>
                  {project.customEmailDomains.map((emailDomain) => (
                    <ManageEmailDomain
                      emailDomain={emailDomain}
                      environmentSlug={environmentSlug}
                      key={emailDomain.id}
                      project={project}
                      team={team}
                    />
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
