'use client'

import * as React from 'react'
import { Secret } from '@forms/fields/Secret/index.js'
import Label from '@forms/Label/index.js'

import { Banner } from '@components/Banner/index.js'
import { CopyToClipboard } from '@components/CopyToClipboard/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Project, Team } from '@root/payload-cloud-types.js'

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
  project: Project
  team: Team
}> = ({ project, team }) => {
  const loadPassword = React.useCallback(async () => {
    const { value } = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/cognito-password`,
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
    <Gutter>
      <div className={classes.fields}>
        <Banner>
          <p>
            Payload Cloud uses AWS Cognito for authentication to your S3 bucket. The{' '}
            <a
              href="https://github.com/payloadcms/payload/tree/main/packages/plugin-cloud#accessing-file-storage-from-local-environment"
              target="_blank"
              rel="noopener noreferrer"
            >
              Payload Cloud Plugin
            </a>{' '}
            will automatically pick up these values. These values are only if you'd like to access
            your files directly, outside of Payload Cloud. Use copy to clipboard below for .env
            formatted values. Paste in Cognito Password separately.
          </p>
        </Banner>
        <Label
          label={<h4>Cognito Variables</h4>}
          className={classes.label}
          actionsSlot={<CopyToClipboard value={formatEnvVars(project)} hoverText="Copy as .env" />}
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
          label="Cognito Password"
          path="cognitoPassword"
          className={classes.secretInput}
          loadSecret={loadPassword}
          readOnly
        />
      </div>
    </Gutter>
  )
}
