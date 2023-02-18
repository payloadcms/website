import React, { Fragment, useEffect } from 'react'
import { components } from 'react-select'
import { Select } from '@forms/fields/Select'

import { GitHubIcon } from '@root/graphics/GitHub'
import { Install, useGetInstalls } from '@root/utilities/use-get-installs'

import classes from './index.module.scss'

const SelectMenuButton = props => {
  return (
    <components.MenuList {...props}>
      {props.children}
      <a
        className={classes.addAccountButton}
        href={`https://github.com/apps/payload-cms/installations/new?client_id=${
          process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
        }&redirect_uri=${encodeURIComponent(
          process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
        )}&state=${encodeURIComponent(`/new/import`)}`}
        type="button"
      >
        Add GitHub Account
      </a>
    </components.MenuList>
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

  const { error: installsError, loading: installsLoading, installs } = useGetInstalls()

  useEffect(() => {
    if (installs.length && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true
      setSelectedInstall(installs[0])
    }
  }, [installs])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedInstall)
    }
  }, [onChange, selectedInstall])

  return (
    <Fragment>
      {installsError && <p>{installsError}</p>}
      {!installsLoading && (
        <Select
          initialValue={installs[0]?.account?.login}
          onChange={option => {
            if (Array.isArray(option)) return
            setSelectedInstall(installs.find(install => install.account.login === option.value))
          }}
          options={[
            ...(installs?.map(install => ({
              label: install.account.login,
              value: install.account.login,
            })) || []),
          ]}
          components={{
            MenuList: SelectMenuButton,
            Option,
          }}
        />
      )}
    </Fragment>
  )
}
