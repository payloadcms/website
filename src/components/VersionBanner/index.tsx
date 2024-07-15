'use client'

import { usePathname } from 'next/navigation'

import { Banner } from '@components/MDX/components/Banner/index.js'

import classes from './index.module.scss'

export const VersionBanner: React.FC = () => {
  const pathname = usePathname()
  const isBeta = pathname.includes('/beta/')
  const isLegacy = pathname.includes('/v2/')

  return isBeta ? (
    <Banner type={'warning'}>
      <strong>Note: </strong>You are currently viewing the <strong>beta version</strong> of the
      docs. Some docs may be inaccurate or incomplete at the moment.{' '}
      <a href="/docs">Switch to the latest version</a>
    </Banner>
  ) : isLegacy ? (
    <Banner type={'warning'}>
      <strong>Note: </strong>You are currently viewing documentation for{' '}
      <strong>version 2.x.x</strong>. Some features may not be supported in later versions of
      Payload. <a href="/docs">Switch to the latest version</a>
    </Banner>
  ) : null
}
