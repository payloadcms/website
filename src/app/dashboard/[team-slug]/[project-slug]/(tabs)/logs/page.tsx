import * as React from 'react'

import { Heading } from '@components/Heading'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'

import classes from './index.module.scss'

export default async () => {
  return (
    <div>
      <Heading element="h5" marginTop={false}>
        Latest build logs
      </Heading>

      <ExtendedBackground
        pixels
        upperChildren={
          <code className={classes.console}>
            Cloning your repo at https://xxx.com Cloned successfully. Running install command
            `yarn`. Install complete. Running build command `yarn build`. Build complete. Starting
            Node process... Successfully started. Build is live!
          </code>
        }
        lowerChildren={
          <code className={classes.console}>
            Cloning your repo at https://xxx.com Cloned successfully. Running install command
            `yarn`. Install complete. Running build command `yarn build`. Build complete. Starting
            Node process... Successfully started. Build is live!
          </code>
        }
      />
    </div>
  )
}
