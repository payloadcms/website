import React, { useEffect, useRef, useState } from 'react'
import { Text } from '@forms/fields/Text/index.js'
import type { Endpoints } from '@octokit/types'

import { Spinner } from '@components/Spinner/index.js'
import { CheckIcon } from '@root/icons/CheckIcon/index.js'
import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import { Project } from '@root/payload-cloud-types.js'
import useDebounce from '@root/utilities/use-debounce.js'

import classes from './index.module.scss'

type GitHubResponse = Endpoints['GET /repos/{owner}/{repo}']['response']

// checks GitHub to ensure that the given repository name is unique
// displays a success message if the name is available
// warns the user if the name is taken
export const RepoExists: React.FC<{
  initialValue?: Project['repositoryFullName']
  onChange?: (value: string) => void
  disabled?: boolean
}> = props => {
  const { initialValue = 'main', onChange, disabled } = props
  const [value, setValue] = React.useState(initialValue)
  const debouncedValue = useDebounce(value, 200)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isRequesting = useRef<string>('')
  const prevRepoOwner = useRef<string | undefined>(undefined)
  const [error, setError] = React.useState<string | null>(null)
  const [repoExists, setRepoExists] = React.useState<boolean | undefined>(undefined)

  useEffect(() => {
    let timer: NodeJS.Timeout

    // run this effect as few times as possible by using the debounced value
    // use a ref to prevent duplicative requests as dependencies of this effect update
    if (debouncedValue && isRequesting.current !== debouncedValue) {
      isRequesting.current = debouncedValue
      setRepoExists(undefined)

      const checkRepositoryName = async () => {
        // only show loading state if the request is slow
        // this will prevent flickering on fast networks
        timer = setTimeout(() => {
          setIsLoading(true)
        }, 200)

        try {
          const repoReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              route: `GET /repos/${debouncedValue}`,
            }),
          })

          clearTimeout(timer)
          const repoRes: GitHubResponse = await repoReq.json()
          setRepoExists(repoRes.status === 200)
          setIsLoading(false)
        } catch (err: unknown) {
          clearTimeout(timer)
          setIsLoading(false)
          setError(`Error validating repository name: ${err}`)
        }
      }

      checkRepositoryName()
    }

    return () => {
      clearTimeout(timer)
    }
  }, [debouncedValue])

  // report changes to parent
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange])

  let description = 'Locate your repository'
  if (!debouncedValue) description = 'Please enter a repository name'
  if (error) description = error
  if (debouncedValue && repoExists === false)
    description = `Repository '${debouncedValue}' was not found. Please choose another.`
  if (debouncedValue && repoExists) description = `Repository '${debouncedValue}' was found`

  let icon: React.ReactNode = null
  if (isLoading) icon = <Spinner />
  if (repoExists) icon = <CheckIcon className={classes.check} size="medium" bold />
  if (error || repoExists === false)
    icon = <CloseIcon className={classes.error} size="medium" bold />

  return (
    <div className={classes.uniqueRepoName}>
      <Text
        label="Repository name"
        path="repositoryName"
        initialValue={initialValue}
        disabled={disabled}
        onChange={setValue}
        placeholder="scope/repo"
        required
        showError={Boolean(!value || error || repoExists === false)}
        icon={icon}
        validate={value => {
          const newValid = Boolean(!value || error || repoExists !== false)
          return newValid
        }}
      />
      <div
        className={[
          classes.description,
          (!value || error || repoExists === false) && !isLoading && classes.error,
          repoExists && !isLoading && classes.success,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {description}
      </div>
    </div>
  )
}
