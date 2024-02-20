import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Select } from '@forms/fields/Select'
import Label from '@forms/Label'

import { LoadingShimmer } from '@components/LoadingShimmer'
import { Install } from '@root/app/(cloud)/cloud/_api/fetchInstalls'
import { usePopupWindow } from '@root/utilities/use-popup-window'
import { MenuList } from './components/MenuList'
import { Option } from './components/Option'
import { SingleValue } from './components/SingleValue'
import { InstallationSelectorProps } from './types'

import classes from './index.module.scss'

export const InstallationSelector: React.FC<InstallationSelectorProps> = props => {
  const {
    onChange,
    value: valueFromProps,
    installs,
    onInstall,
    error,
    loading,
    description,
    disabled,
    hideLabel,
    className,
    uuid,
  } = props

  // this will be validated after the redirect back
  const [href] = useState(`https://github.com/apps/payload-cms/installations/new?state=${uuid}`)

  const selectAfterLoad = useRef<Install['id']>()

  const [selection, setSelection] = useState<Install | undefined>(() => {
    if (installs?.length) {
      if (valueFromProps !== undefined) {
        const idFromProps =
          typeof valueFromProps === 'string' ? parseInt(valueFromProps, 10) : valueFromProps
        return installs.find(install => install.id === idFromProps)
      } else {
        return installs[0]
      }
    }
  })

  const { openPopupWindow } = usePopupWindow({
    href,
    eventType: 'github',
    onMessage: async (searchParams: { state: string; installation_id: string }) => {
      if (searchParams.state === uuid) {
        selectAfterLoad.current = parseInt(searchParams.installation_id, 10)
        if (typeof onInstall === 'function') onInstall()
      }
    },
  })

  useEffect(() => {
    if (selectAfterLoad.current) {
      const newSelection = installs?.find(install => install.id === selectAfterLoad.current)
      setSelection(newSelection)
      selectAfterLoad.current = undefined
    }
  }, [installs])

  return (
    <div className={className}>
      {error && <p>{error}</p>}
      {loading && (
        <Fragment>
          {!hideLabel && <Label label="GitHub Scope" htmlFor="github-installation" />}
          <LoadingShimmer />
        </Fragment>
      )}
      {!loading && (
        <Select
          label={!hideLabel ? 'GitHub Scope' : undefined}
          value={(selection?.account as { login: string })?.login}
          initialValue={(installs?.[0]?.account as { login: string })?.login}
          onChange={option => {
            if (Array.isArray(option)) return
            const newSelection = installs?.find(
              install => (install?.account as { login: string })?.login === option,
            )
            setSelection(newSelection)
            if (typeof onChange === 'function') {
              onChange(newSelection)
            }
          }}
          options={[
            ...(installs && installs.length > 0
              ? [
                  ...installs.map(install => ({
                    label: (install?.account as { login: string })?.login || 'Untitled',
                    value: (install?.account as { login: string })?.login || '',
                  })),
                ]
              : [
                  {
                    label: 'No installations found',
                    value: 'no-accounts',
                  },
                ]),
          ]}
          selectProps={{
            openPopupWindow,
            href,
          }}
          components={{
            MenuList,
            Option,
            SingleValue,
          }}
          disabled={disabled}
        />
      )}
      {description && <p className={classes.description}>{description}</p>}
    </div>
  )
}
