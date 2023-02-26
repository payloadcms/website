import React, { Fragment, useEffect } from 'react'
import { components } from 'react-select'
import { Select } from '@forms/fields/Select'
import Label from '@forms/Label'
import { v4 as uuid } from 'uuid'

import { LoadingShimmer } from '@components/LoadingShimmer'
import { GitHubIcon } from '@root/graphics/GitHub'
import useDebounce from '@root/utilities/use-debounce'
import { Install, useGetInstalls } from '@root/utilities/use-get-installs'
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

export const ScopeSelector: React.FC<{
  value?: string
  onChange?: (value: Install) => void // eslint-disable-line no-unused-vars
  onLoading?: (loading: boolean) => void // eslint-disable-line no-unused-vars
}> = props => {
  const { onChange, value: valueFromProps, onLoading } = props
  const hasInitializedSelection = React.useRef(false)
  const [selectedInstall, setSelectedInstall] = React.useState<Install | undefined>()

  const {
    error: installsError,
    loading: installsLoading,
    installs,
    reloadInstalls,
  } = useGetInstalls()

  useEffect(() => {
    if (typeof onLoading === 'function') {
      onLoading(installsLoading)
    }
  }, [installsLoading, onLoading])

  useEffect(() => {
    if (valueFromProps === selectedInstall?.id && installs?.length) {
      const newSelection = installs.find(install => install.id === valueFromProps)
      setSelectedInstall(newSelection)
    }
  }, [valueFromProps, installs, selectedInstall])

  const { openPopupWindow } = usePopupWindow({
    href,
    eventType: 'github-oauth',
    onMessage: async searchParams => {
      if (searchParams.state === id) {
        await reloadInstalls()
        setSelectedInstall(searchParams.installation_id)
      }
    },
  })

  useEffect(() => {
    if (installs?.length && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true
      setSelectedInstall(installs[installs.length - 1])
    }
  }, [installs])

  const loading = useDebounce(installsLoading, 250)

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedInstall)
    }
  }, [onChange, selectedInstall])

  return (
    <Fragment>
      {installsError && <p>{installsError}</p>}
      {loading && (
        <Fragment>
          <Label label="GitHub Scope" htmlFor="github-scope" />
          <LoadingShimmer />
        </Fragment>
      )}
      {!loading && (
        <Select
          label="GitHub Scope"
          value={selectedInstall?.account?.login}
          initialValue={installs?.[0]?.account?.login}
          onChange={option => {
            if (Array.isArray(option)) return
            setSelectedInstall(installs.find(install => install.account.login === option.value))
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
