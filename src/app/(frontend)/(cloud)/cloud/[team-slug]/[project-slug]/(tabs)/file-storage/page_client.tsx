'use client'

import type { Project, Team } from '@root/payload-cloud-types'

import { Banner } from '@components/Banner/index'
import { CopyToClipboard } from '@components/CopyToClipboard/index'
import { Gutter } from '@components/Gutter/index'
import { Secret } from '@forms/fields/Secret/index'
import Label from '@forms/Label/index'
import * as React from 'react'

import classes from './page.module.scss'

/**
 * Copy values in .env file format
 */
const formatEnvVars = (project: Project): string => {
  return `PAYLOAD_CLOUD=true
PAYLOAD_CLOUD_ENVIRONMENT=prod
PAYLOAD_CLOUD_COGNITO_USER_POOL_CLIENT_ID=${project.cognitoUserPoolClientID}
PAYLOAD_CLOUD_COGNITO_USER_POOL_ID=${project.cognitoUserPoolID}
PAYLOAD_CLOUD_COGNITO_IDENTITY_POOL_ID=${project.cognitoIdentityPoolID}
PAYLOAD_CLOUD_PROJECT_ID=${project.id}
PAYLOAD_CLOUD_BUCKET=${project.s3Bucket}
PAYLOAD_CLOUD_BUCKET_REGION=${project.s3BucketRegion}

# Copy this value from 'Cognito Password' field on File Storage page
PAYLOAD_CLOUD_COGNITO_PASSWORD=
`
}

export const ProjectFileStoragePage: React.FC<{
  environmentSlug: string
  project: Project
  team: Team
}> = ({ environmentSlug, project, team }) => {
  const loadPassword = React.useCallback(async () => {
    const { value } = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/cognito-password${
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
    <Gutter>
      <div className={classes.fields}>
        <Banner>
          <p>
            Payload Cloud uses AWS Cognito for authentication to your S3 bucket. The{' '}
            <a
              href="https://github.com/payloadcms/payload/tree/main/packages/payload-cloud#accessing-file-storage-from-local-environment"
              rel="noopener noreferrer"
              target="_blank"
            >
              Payload Cloud Plugin
            </a>{' '}
            will automatically pick up these values. These values are only if you'd like to access
            your files directly, outside of Payload Cloud. Use copy to clipboard below for .env
            formatted values. Paste in Cognito Password separately.
          </p>
        </Banner>
        <Label
          actionsSlot={<CopyToClipboard hoverText="Copy as .env" value={formatEnvVars(project)} />}
          className={classes.label}
          label={<h4>Cognito Variables</h4>}
        />
        <ul className={classes.meta}>
          <li>
            <strong>Cognito User Pool ID</strong>
            <span>{project?.cognitoUserPoolID}</span>
          </li>
          <li>
            <strong>Cognito User Pool Client ID</strong>
            <span>{project?.cognitoUserPoolClientID}</span>
          </li>
          <li>
            <strong>Cognito Identity Pool ID</strong>
            <span>{project?.cognitoIdentityPoolID}</span>
          </li>
          <li>
            <strong>Cognito Username</strong>
            <span>{project?.id}</span>
          </li>
          <li>
            <strong>Cognito Identity ID</strong>
            <span>{project?.cognitoIdentityID}</span>
          </li>
          <li>
            <strong>Bucket name</strong>
            <span>{project?.s3Bucket}</span>
          </li>
          <li>
            <strong>Bucket region</strong>
            <span>{project?.s3BucketRegion}</span>
          </li>
        </ul>
        <Secret
          className={classes.secretInput}
          label="Cognito Password"
          loadSecret={loadPassword}
          path="cognitoPassword"
          readOnly
        />
      </div>
    </Gutter>
  )
}
