'use client'

import * as React from 'react'
import { Secret } from '@forms/fields/Secret'

import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'

import classes from './index.module.scss'

export default () => {
  return (
    <div>
      <ExtendedBackground
        pixels
        upperChildren={
          <div className={classes.fields}>
            <Secret
              label="S3 Endpoint"
              path="s3Endpoint"
              className={classes.secretInput}
              loadSecret={() => Promise.resolve('some-secret')}
            />

            <Secret
              label="S3 Access Key"
              path="s3AccessKey"
              className={classes.secretInput}
              loadSecret={() => Promise.resolve('s3-access-key')}
            />

            <Secret
              label="S3 Secret Access"
              path="s3SecretAccess"
              className={classes.secretInput}
              loadSecret={() => Promise.resolve('some-secret')}
            />

            <Secret
              label="S3 Bucket"
              path="s3Bucket"
              className={classes.secretInput}
              loadSecret={() => Promise.resolve('some-secret')}
            />

            <Secret
              label="S3 Region"
              path="s3Region"
              className={classes.secretInput}
              loadSecret={() => Promise.resolve('some-secret')}
            />
          </div>
        }
      />
    </div>
  )
}
