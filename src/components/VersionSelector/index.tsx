'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { getTopics } from '@root/app/(pages)/docs/api'
import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon'

import classes from './index.module.scss'

export const VersionSelector: React.FC<{
  initialVersion: 'current' | 'v2'
}> = ({ initialVersion }) => {
  const router = useRouter()

  return (
    <div className={classes.wrapper}>
      <div className={classes.pill}>
        {initialVersion === 'current' ? (
          <span className={classes.current}>Current</span>
        ) : (
          <span className={classes.legacy}>Legacy</span>
        )}
      </div>

      <select
        className={classes.select}
        onChange={async e => {
          if (!e.target.value || e.target.value === initialVersion) return
          if (e.target.value === 'current') {
            router.push('/docs')
          } else {
            if (e.target.value !== 'v2') return
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
        <option className={[classes.option, classes.current].join(' ')} value={'current'}>
          Version 3.x
        </option>
        <option className={[classes.option, classes.legacy].join(' ')} value={'v2'}>
          Version 2.x
        </option>
      </select>
      <ChevronUpDownIcon className={classes.icon} aria-hidden="true" />
    </div>
  )
}
