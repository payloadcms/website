'use client'
import type { DocsVersion } from '@components/RenderDocs'

import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon/index'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import classes from './index.module.scss'

export const VersionSelector: React.FC<{
  initialVersion: DocsVersion
}> = ({ initialVersion }) => {
  const pathname = usePathname()
  const router = useRouter()
  const selectedVersion =
    initialVersion === 'local' || initialVersion === 'current'
      ? 'latest'
      : initialVersion === 'local/v4'
        ? 'beta'
        : initialVersion

  // TODO: Remove this local-to-local routing before completing the v4 docs preparation branch.
  // It exists only to verify v3/v4 preview isolation without relying on remotely synced docs.
  const getVersionPath = (nextVersion: string) => {
    if (pathname.startsWith('/docs/local/v4/')) {
      const docPath = pathname.slice('/docs/local/v4/'.length)

      return nextVersion === 'latest' ? `/docs/local/${docPath}` : pathname
    }

    if (pathname.startsWith('/docs/local/')) {
      const docPath = pathname.slice('/docs/local/'.length)

      return nextVersion === 'beta' ? `/docs/local/v4/${docPath}` : pathname
    }

    return nextVersion === 'latest' ? '/docs' : `/docs/${nextVersion}`
  }

  return (
    <div className={classes.wrapper}>
      <select
        aria-label="Select Version"
        className={classes.select}
        value={selectedVersion}
        onChange={(e) => {
          router.push(getVersionPath(e.target.value))
        }}
      >
        <option
          className={[classes.option, classes.current].join(' ')}
          label="Version 3"
          value="latest"
        />
        {process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS === 'true' && (
          <option className={classes.option} label="Version 4 (Beta)" value="beta" />
        )}
        {process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS === 'true' && (
          <option
            className={[classes.option, classes.legacy].join(' ')}
            label="Version 2"
            value="v2"
          />
        )}
      </select>
      <ChevronUpDownIcon aria-hidden="true" className={classes.icon} />
    </div>
  )
}
