'use client'

import { usePathname } from 'next/navigation'

import { Banner } from '@components/Banner'

import classes from './index.module.scss'

export const VersionBanner: React.FC = () => {
  const pathname = usePathname()
  const isBeta = pathname.includes('/beta/')
  const isLegacy = pathname.includes('/legacy/')

  return (
    (isBeta || isLegacy) && (
      <div className={classes.bannerWrapper}>
        {isBeta ? (
          <Banner type={'warning'}>
            <strong>Note: </strong>You are currently viewing the <strong>beta version</strong> of
            the docs. Some features may not be available or may not work as expected.{' '}
            <a href="/docs">Switch to the latest version</a>
          </Banner>
        ) : isLegacy ? (
          <Banner type={'warning'}>
            <strong>Note: </strong>You are currently viewing the <strong>legacy version</strong> of
            the docs. Some features may not work as expected in this version.{' '}
            <a href="/docs">Switch to the latest version</a>
          </Banner>
        ) : null}
      </div>
    )
  )
}
