'use client'
import { useEffect, useState } from 'react'

import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon'
import { setVersionCookie } from './actions'

import classes from './index.module.scss'

export const VersionSelector: React.FC = () => {
  const [version, setVersion] = useState('current')

  useEffect(() => {
    setVersionCookie(version)
  }, [version])

  return (
    <div className={classes.wrapper}>
      <select className={classes.select} onChange={e => setVersion(e.target.value)}>
        <option className={classes.option} value={'current'}>
          Version 3.x
        </option>
        <option className={classes.option} value={'v2'}>
          Version 2.x
        </option>
      </select>
      <ChevronUpDownIcon className={classes.icon} />
    </div>
  )
}
