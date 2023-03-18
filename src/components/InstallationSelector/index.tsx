import React, { Fragment, useEffect, useMemo } from 'react'
import { components } from 'react-select'
import { v4 as uuid } from 'uuid'

import { LoadingShimmer } from '@components/LoadingShimmer'
import { Select } from '@forms/fields/Select'
import Label from '@forms/Label'
import { GitHubIcon } from '@root/graphics/GitHub'
import useDebounce from '@root/utilities/use-debounce'
import { Install, UseGetInstalls, useGetInstalls } from '@root/utilities/use-get-installs'
import { usePopupWindow } from '@root/utilities/use-popup-window'

import classes from './index.module.scss'

// generate an id to use for the state
// this will be validated after the the redirect back
const id = uuid()

const href = `https://github.com/apps/payload-cms/installations/new?state=${id}`

const SelectMenuButton = props => {
  const {
    selectProps: { selectProps },
  } = props

  return (
    <components.MenuList {...props}>
      {props.children}
      <a className={classes.addAccountButton} href={href} onClick={selectProps?.openPopupWindow}>
        Add GitHub Account
      </a>
    </components.MenuList>
  )
}

const SingleValue = props => {
  return (
    <components.SingleValue {...props}>
      <div className={classes.option}>
        <div className={classes.githubIcon}>
          <GitHubIcon />
        </div>
        <div className={classes.optionLabel}>{props.children}</div>
      </div>
    </components.SingleValue>
  )
}

const Option = props => {
  return (
    <components.Option {...props}>
      <div className={classes.option}>
        <div className={classes.githubIcon}>
          <GitHubIcon />
        </div>
        <div className={classes.optionLabel}>{props.label}</div>
      </div>
    </components.Option>
  )
}

type InstallationSelectorProps = {
  value?: Install['id']
  onChange?: (value?: Install) => void // eslint-disable-line no-unused-vars
  installs?: Install[]
  reloadInstalls: ReturnType<UseGetInstalls>['reload']
  loading?: boolean
  error?: string
}

export const InstallationSelector: React.FC<InstallationSelectorProps> = props => {
  const { onChange, value: valueFromProps, installs, reloadInstalls, error, loading } = props
  const hasInitializedSelection = React.useRef(false)
  const selectAfterLoad = React.useRef<Install['id']>()
  const [selection, setSelection] = React.useState<Install | undefined>()

  useEffect(() => {
    if (
      hasInitializedSelection &&
      valueFromProps !== undefined &&
      valueFromProps === selection?.id &&
      installs?.length
    ) {
      const newSelection = installs.find(install => install.id === valueFromProps)
      setSelection(newSelection)
    }
  }, [valueFromProps, installs, selection])

  const { openPopupWindow } = usePopupWindow({
    href,
    eventType: 'github-install',
    onMessage: async (searchParams: { state: string; installation_id: string }) => {
      if (searchParams.state === id) {
        selectAfterLoad.current = parseInt(searchParams.installation_id, 10)
        reloadInstalls()
      }
    },
  })

  useEffect(() => {
    if (installs?.length && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true
      setSelection(installs[installs.length - 1])
    }
  }, [installs])

  useEffect(() => {
    if (selectAfterLoad.current) {
      const newSelection = installs?.find(install => install.id === selectAfterLoad.current)
      setSelection(newSelection)
      selectAfterLoad.current = undefined
    }
  }, [installs])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selection)
    }
  }, [selection, onChange])

  return (
    <Fragment>
      {error && <p>{error}</p>}
      {loading && (
        <Fragment>
          <Label label="GitHub Scope" htmlFor="github-installation" />
          <LoadingShimmer />
        </Fragment>
      )}
      {!loading && (
        <Select
          label="GitHub Scope"
          value={selection?.account?.login}
          initialValue={installs?.[0]?.account?.login}
          onChange={option => {
            if (Array.isArray(option)) return
            const newSelection = installs?.find(install => install.account.login === option.value)
            setSelection(newSelection)
          }}
          options={[
            ...(installs && installs.length > 0
              ? [
                  ...installs.map(install => ({
                    label: install.account.login,
                    value: install.account.login,
                  })),
                ]
              : [
                  {
                    label: 'No GitHub accounts found',
                    value: 'no-accounts',
                  },
                ]),
          ]}
          selectProps={{
            openPopupWindow,
          }}
          components={{
            MenuList: SelectMenuButton,
            Option,
            SingleValue,
          }}
        />
      )}
    </Fragment>
  )
}

export const useInstallationSelector = (): [
  React.FC,
  ReturnType<UseGetInstalls> & {
    value?: Install
  },
] => {
  const [value, setValue] = React.useState<Install | undefined>(undefined)
  const installsData = useGetInstalls()
  const debouncedLoading = useDebounce(installsData.loading, 250)

  const MemoizedInstallationSelector = useMemo(
    () => () => {
      const { error, installs, reload } = installsData

      return (
        <InstallationSelector
          loading={debouncedLoading}
          error={error}
          installs={installs}
          reloadInstalls={reload}
          onChange={setValue}
        />
      )
    },
    [installsData, debouncedLoading],
  )

  return [
    MemoizedInstallationSelector,
    {
      ...installsData,
      value,
    },
  ]
}
