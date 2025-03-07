import type { Endpoints } from '@octokit/types'
import type { Project } from '@root/payload-cloud-types'

import { Spinner } from '@components/Spinner/index'
import { Text } from '@forms/fields/Text/index'
import { CheckIcon } from '@root/icons/CheckIcon/index'
import { CloseIcon } from '@root/icons/CloseIcon/index'
import useDebounce from '@root/utilities/use-debounce'
import React, { useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'

type GitHubResponse = Endpoints['GET /repos/{owner}/{repo}']['response']

// checks GitHub to ensure that the given repository name is unique
// displays a success message if the name is available
// warns the user if the name is taken
export const UniqueRepoName: React.FC<{
  initialValue?: Project['repositoryFullName']
  onChange?: (value: string) => void
  repositoryOwner?: string // i.e. `trouble`
}> = (props) => {
  const { initialValue = '', onChange, repositoryOwner } = props
  const [value, setValue] = React.useState(initialValue)
  const debouncedValue = useDebounce(value, 200)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isRequesting = useRef<string>('')
  const prevRepoOwner = useRef<string | undefined>(undefined)
  const [error, setError] = React.useState<null | string>(null)
  const [isAvailable, setIsAvailable] = React.useState<boolean | undefined>(undefined)

  useEffect(() => {
    let timer: NodeJS.Timeout

    // run this effect as few times as possible by using the debounced value
    // use a ref to prevent duplicative requests as dependencies of this effect update
    if (
      debouncedValue &&
      repositoryOwner &&
      (isRequesting.current !== debouncedValue || repositoryOwner !== prevRepoOwner.current)
    ) {
      isRequesting.current = debouncedValue
      prevRepoOwner.current = repositoryOwner
      setIsAvailable(undefined)

      const checkRepositoryName = async () => {
        // only show loading state if the request is slow
        // this will prevent flickering on fast networks
        timer = setTimeout(() => {
          setIsLoading(true)
        }, 200)

        try {
          const repoReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
            body: JSON.stringify({
              route: `GET /repos/${repositoryOwner}/${debouncedValue}`,
            }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          clearTimeout(timer)
          const repoRes: GitHubResponse = await repoReq.json()
          setIsAvailable(repoRes.status !== 200)
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
  }, [repositoryOwner, debouncedValue])

  // report changes to parent
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange])

  let description = 'Choose a repository name'
  if (!debouncedValue) {
    description = 'Please enter a repository name'
  }
  if (error) {
    description = error
  }
  if (debouncedValue && isAvailable === false) {
    description = `'${debouncedValue}' is not available. Please choose another.`
  }
  if (debouncedValue && isAvailable) {
    description = `'${debouncedValue}' is available`
  }

  let icon: React.ReactNode = null
  if (isLoading) {
    icon = <Spinner />
  }
  if (isAvailable) {
    icon = <CheckIcon bold className={classes.check} size="medium" />
  }
  if (error || isAvailable === false) {
    icon = <CloseIcon bold className={classes.error} size="medium" />
  }

  return (
    <div className={classes.uniqueRepoName}>
      <Text
        icon={icon}
        initialValue={initialValue}
        label="Repository name"
        onChange={setValue}
        path="repositoryName"
        placeholder="Choose the name of your repository"
        required
        showError={Boolean(!value || error || isAvailable === false)}
        validate={(value) => {
          const newValid = Boolean(!value || error || isAvailable !== false)
          return newValid
        }}
      />
      <div
        className={[
          classes.description,
          (!value || error || isAvailable === false) && !isLoading && classes.error,
          isAvailable && !isLoading && classes.success,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {description}
      </div>
    </div>
  )
}
