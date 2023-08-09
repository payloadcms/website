import React, { Fragment, useEffect, useMemo } from 'react'
import { components } from 'react-select'
import { Select } from '@forms/fields/Select'
import Label from '@forms/Label'
import { v4 as uuid } from 'uuid'

import {
  Install,
  UseGetInstalls,
  useGetInstalls,
} from '@components/InstallationSelector/useGetInstalls'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { GitHubIcon } from '@root/graphics/GitHub'
import useDebounce from '@root/utilities/use-debounce'
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
      {/* use an anchor tag with an href despite the onClick for better UX */}
      <a className={classes.addAccountButton} href={href} onClick={selectProps?.openPopupWindow}>
        Install GitHub app
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
  description?: string
  disabled?: boolean
  hideLabel?: boolean
}

export const InstallationSelector: React.FC<InstallationSelectorProps> = props => {
  const {
    onChange,
    value: valueFromProps,
    installs,
    reloadInstalls,
    error,
    loading,
    description,
    disabled,
    hideLabel,
  } = props

  const selectAfterLoad = React.useRef<Install['id']>()

  const [selection, setSelection] = React.useState<Install | undefined>(() => {
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
      if (searchParams.state === id) {
        selectAfterLoad.current = parseInt(searchParams.installation_id, 10)
        reloadInstalls()
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
    <div>
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
          value={selection?.account?.login}
          initialValue={installs?.[0]?.account?.login}
          onChange={option => {
            if (Array.isArray(option)) return
            const newSelection = installs?.find(install => install?.account?.login === option)
            setSelection(newSelection)
            if (typeof onChange === 'function') {
              onChange(newSelection)
            }
          }}
          options={[
            ...(installs && installs.length > 0
              ? [
                  ...installs.map(install => ({
                    label: install?.account?.login || 'Untitled',
                    value: install?.account?.login || '',
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
          }}
          components={{
            MenuList: SelectMenuButton,
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

type UseInstallationSelectorArgs = Parameters<UseGetInstalls>[0] & {
  initialInstallID?: string
  onChange?: (value?: Install) => void
  hideLabel?: boolean
}

export const useInstallationSelector = (
  args: UseInstallationSelectorArgs = {},
): [
  React.FC<{
    description?: string
    disabled?: boolean
    hideLabel?: boolean
  }>,
  ReturnType<UseGetInstalls> & {
    value?: Install
    description?: string
  },
] => {
  const { initialInstallID, permissions, installs: initialInstalls, onChange } = args
  const [value, setValue] = React.useState<Install | undefined>(initialInstalls?.[0])
  const installsData = useGetInstalls({ permissions, installs: initialInstalls })
  const { error, installs, reload, loading } = installsData

  const debouncedLoading = useDebounce(loading, 250)

  const MemoizedInstallationSelector = useMemo(
    () =>
      ({ description, disabled, hideLabel }) => {
        return (
          <InstallationSelector
            value={initialInstallID ? Number(initialInstallID) : undefined}
            loading={debouncedLoading}
            error={error}
            installs={installs}
            reloadInstalls={reload}
            hideLabel={hideLabel}
            onChange={(setV: Install) => {
              setValue(setV)
              if (typeof onChange === 'function') {
                onChange(setV)
              }
            }}
            description={description}
            disabled={disabled}
          />
        )
      },
    [error, installs, reload, debouncedLoading, initialInstallID, onChange],
  )

  return [
    MemoizedInstallationSelector,
    {
      ...installsData,
      value,
    },
  ]
}
