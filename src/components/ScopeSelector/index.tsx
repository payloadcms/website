import React, { Fragment, useEffect } from 'react'
import { components } from 'react-select'
import { Select } from '@forms/fields/Select'

import { LoadingShimmer } from '@components/LoadingShimmer'
import { GitHubIcon } from '@root/graphics/GitHub'
import useDebounce from '@root/utilities/use-debounce'
import { Install, useGetInstalls } from '@root/utilities/use-get-installs'
import { usePopup } from '@root/utilities/use-popup'

import classes from './index.module.scss'

const href = `https://github.com/apps/payload-cms/installations/new?client_id=${
  process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
}&redirect_uri=${encodeURIComponent(
  process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
)}&state=${encodeURIComponent(`/new/import`)}`

const SelectMenuButton = props => {
  const {
    selectProps: { selectProps },
  } = props

  return (
    <components.MenuList {...props}>
      {props.children}
      <a className={classes.addAccountButton} href={href} onClick={selectProps?.openPopup}>
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
  onChange: (value: Install) => void // eslint-disable-line no-unused-vars
}> = props => {
  const { onChange } = props
  const hasInitializedSelection = React.useRef(false)
  const [selectedInstall, setSelectedInstall] = React.useState<Install | undefined>(undefined)

  const {
    error: installsError,
    loading: installsLoading,
    installs,
    reloadInstalls,
  } = useGetInstalls()

  const { openPopup } = usePopup({
    href,
    eventType: 'github-oauth',
    onMessage: reloadInstalls,
  })

  useEffect(() => {
    if (installs.length && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true
      setSelectedInstall(installs[0])
    }
  }, [installs])

  const loading = useDebounce(installsLoading, 1000)

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedInstall)
    }
  }, [onChange, selectedInstall])

  return (
    <Fragment>
      {installsError && <p>{installsError}</p>}
      {loading && <LoadingShimmer number={1} />}
      {!loading && (
        <Select
          initialValue={installs[0]?.account?.login}
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
            openPopup,
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
