'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import { Secret } from '@forms/fields/Secret'

import { Banner } from '@components/Banner'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'

import classes from './index.module.scss'

export default () => {
  const { project } = useRouteData()

  const loadPassword = React.useCallback(async () => {
    const { value } = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}/cognito-password`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(res => res.json())

    return value
  }, [project.id])

  return (
    <div>
      <ExtendedBackground
        pixels
        upperChildren={
          <div className={classes.fields}>
            <Banner>
              <p>
                Payload Cloud uses AWS Cognito for authentication to your S3 bucket. To set up your
                app to store its files to S3 using the credentials below, make sure your project's
                Payload config has the official{' '}
                <a
                  href="https://github.com/payloadcms/plugin-cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Payload Cloud Plugin
                </a>{' '}
                installed.
              </p>
            </Banner>
            <ul className={classes.meta}>
              <li>
                <strong>Cognito User Pool ID</strong>
                <span>{project.cognitoUserPoolID}</span>
              </li>
              <li>
                <strong>Cognito User Pool Client ID</strong>
                <span>{project.cognitoUserPoolClientID}</span>
              </li>
              <li>
                <strong>Cognito Identity Pool ID</strong>
                <span>{project.cognitoIdentityPoolID}</span>
              </li>
              <li>
                <strong>Cognito Username</strong>
                <span>{project.id}</span>
              </li>
              <li>
                <strong>Cognito Identity ID</strong>
                <span>{project.cognitoIdentityID}</span>
              </li>
              <li>
                <strong>Bucket name</strong>
                <span>{project.s3Bucket}</span>
              </li>
              <li>
                <strong>Bucket region</strong>
                <span>{project.s3BucketRegion}</span>
              </li>
            </ul>
            <Secret
              label="Cognito Password"
              path="cognitoPassword"
              className={classes.secretInput}
              loadSecret={loadPassword}
            />
          </div>
        }
      />
    </div>
  )
}
