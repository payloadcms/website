'use client'
import { useRouter } from 'next/navigation'

import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon/index.js'

import classes from './index.module.scss'

export const VersionSelector: React.FC<{
  initialVersion: 'current' | 'v2' | 'beta'
}> = ({ initialVersion }) => {
  const router = useRouter()

  return (
    <div className={classes.wrapper}>
      <select
        className={classes.select}
        onChange={e => {
          e.target.value === 'latest'
            ? router.push('/docs')
            : router.push(`/docs/${e.target.value}`)
        }}
        defaultValue={initialVersion}
        aria-label="Select Version"
      >
        <option
          className={[classes.option, classes.current].join(' ')}
          value={'latest'}
          label="Latest Version"
        />
        {process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS === 'true' && (
          <option className={classes.option} value={'beta'} label="v3.0.0 (Beta)" />
        )}
        {process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS === 'true' && (
          <option
            className={[classes.option, classes.legacy].join(' ')}
            value={'v2'}
            label={`v2.x`}
          />
        )}
      </select>
      <ChevronUpDownIcon className={classes.icon} aria-hidden="true" />
    </div>
  )
}
