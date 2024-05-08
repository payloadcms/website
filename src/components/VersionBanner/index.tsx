'use client'

import { usePathname } from 'next/navigation'

import { Banner } from '@components/MDX/components/Banner'

import classes from './index.module.scss'

export const VersionBanner: React.FC = () => {
  const pathname = usePathname()
  const isBeta = pathname.includes('/beta/')
  const isLegacy = pathname.includes('/legacy/')

  return isBeta ? (
    <Banner type={'warning'}>
      <strong>Note: </strong>You are currently viewing the <strong>beta version</strong> of the
      docs. Some docs may be innacurate or incomplete at the moment.{' '}
      <a href="/docs">Switch to the latest version</a>
    </Banner>
  ) : isLegacy ? (
    <Banner type={'warning'}>
      <strong>Note: </strong>You are currently viewing the <strong>legacy version</strong> of the
      docs. Some features may not be supported in later versions of Payload.{' '}
      <a href="/docs">Switch to the latest version</a>
    </Banner>
  ) : null
}
