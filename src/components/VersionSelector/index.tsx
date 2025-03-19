'use client'
import type { DocsVersion } from '@components/RenderDocs'

import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon/index'
import { useRouter } from 'next/navigation'
import React from 'react'

import classes from './index.module.scss'

export const VersionSelector: React.FC<{
  initialVersion: DocsVersion
}> = ({ initialVersion }) => {
  const router = useRouter()

  return (
    <div className={classes.wrapper}>
      <select
        aria-label="Select Version"
        className={classes.select}
        defaultValue={initialVersion}
        onChange={(e) => {
          e.target.value === 'latest'
            ? router.push('/docs')
            : router.push(`/docs/${e.target.value}`)
        }}
      >
        <option
          className={[classes.option, classes.current].join(' ')}
          label="Version 3"
          value="latest"
        />
        {process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS === 'true' && (
          <option className={classes.option} label="Beta" value="beta" />
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
