import type { Install } from '@cloud/_api/fetchInstalls'

import { LoadingShimmer } from '@components/LoadingShimmer/index'
import { Select } from '@forms/fields/Select/index'
import Label from '@forms/Label/index'
import { usePopupWindow } from '@root/utilities/use-popup-window'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import type { InstallationSelectorProps } from './types'

import { MenuList } from './components/MenuList/index'
import { Option } from './components/Option/index'
import { SingleValue } from './components/SingleValue/index'
import classes from './index.module.scss'

export const InstallationSelector: React.FC<InstallationSelectorProps> = (props) => {
  const {
    className,
    description,
    disabled,
    error,
    hideLabel,
    installs,
    loading,
    onChange,
    onInstall,
    uuid,
    value: valueFromProps,
  } = props

  // this will be validated after the redirect back
  const [href] = useState(`https://github.com/apps/payload-cms/installations/new?state=${uuid}`)

  const selectAfterLoad = useRef<Install['id']>(undefined)

  const [selection, setSelection] = useState<Install | undefined>(() => {
    if (installs?.length) {
      if (valueFromProps !== undefined) {
        const idFromProps =
          typeof valueFromProps === 'string' ? parseInt(valueFromProps, 10) : valueFromProps
        return installs.find((install) => install.id === idFromProps)
      } else {
        return installs[0]
      }
    }
  })

  const { openPopupWindow } = usePopupWindow({
    eventType: 'github',
    href,
    onMessage: async (searchParams: { installation_id: string; state: string }) => {
      if (searchParams.state === uuid) {
        selectAfterLoad.current = parseInt(searchParams.installation_id, 10)
        if (typeof onInstall === 'function') {
          onInstall()
        }
      }
    },
  })

  useEffect(() => {
    if (selectAfterLoad.current) {
      const newSelection = installs?.find((install) => install.id === selectAfterLoad.current)
      setSelection(newSelection)
      selectAfterLoad.current = undefined
    }
  }, [installs])

  return (
    <div className={className}>
      {error && <p>{error}</p>}
      {loading && (
        <Fragment>
          {!hideLabel && <Label htmlFor="github-installation" label="GitHub Scope" />}
          <LoadingShimmer />
        </Fragment>
      )}
      {!loading && (
        <Select
          components={{
            MenuList: (menuListProps) => (
              <MenuList {...menuListProps} href={href} openPopupWindow={openPopupWindow} />
            ),
            Option,
            SingleValue,
          }}
          disabled={disabled}
          initialValue={(installs?.[0]?.account as { login: string })?.login}
          label={!hideLabel ? 'GitHub Scope' : undefined}
          onChange={(option) => {
            if (Array.isArray(option)) {
              return
            }
            const newSelection = installs?.find(
              (install) => (install?.account as { login: string })?.login === option,
            )
            setSelection(newSelection)
            if (typeof onChange === 'function') {
              onChange(newSelection)
            }
          }}
          options={[
            ...(installs && installs.length > 0
              ? [
                  ...installs.map((install) => ({
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
          value={(selection?.account as { login: string })?.login}
        />
      )}
      {description && <p className={classes.description}>{description}</p>}
    </div>
  )
}
