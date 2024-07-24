'use client'
import { useRouter } from 'next/navigation'

import { getTopics } from '@root/app/(pages)/docs/api.js'
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
        onChange={async e => {
          if (!e.target.value || e.target.value === initialVersion) return
          if (e.target.value === 'current') {
            router.push('/docs')
          } else if (e.target.value === 'v2' || e.target.value === 'beta') {
            const topics = await getTopics(e.target.value)
            const defaultRoute = `/docs/${e.target.value}/${topics[0].slug.toLowerCase()}/${
              topics[0].docs[0].slug
            }`
            router.push(defaultRoute)
          }
        }}
        defaultValue={initialVersion}
        aria-label="Select Version"
      >
        <option
          className={[classes.option, classes.current].join(' ')}
          value={'current'}
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
