'use client'

import type { Plan, Project, Team } from '@root/payload-cloud-types.js'

import { cloudSlug } from '@cloud/slug.js'
import { Accordion } from '@components/Accordion/index.js'
import { Banner } from '@components/Banner/index.js'
import Code from '@components/Code/index.js'
import { HR } from '@components/HR/index.js'
import { MaxWidth } from '@components/MaxWidth/index.js'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'
import { Secret } from '@forms/fields/Secret/index.js'
import { Text } from '@forms/fields/Text/index.js'
import * as React from 'react'

import { NoData } from '../_layoutComponents/NoData/index.js'
import { SectionHeader } from '../_layoutComponents/SectionHeader/index.js'
import { AddEmailDomain } from './AddEmailDomain/index.js'
import { ManageEmailDomain } from './ManageEmailDomain/index.js'

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
                  {project.customEmailDomains.map(emailDomain => (
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
