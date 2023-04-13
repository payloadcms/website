import React, { useEffect, useRef, useState } from 'react'
import { Text } from '@forms/fields/Text'
import type { Endpoints } from '@octokit/types'

import useDebounce from '@root/utilities/use-debounce'

import classes from './index.module.scss'

type GitHubResponse = Endpoints['GET /repos/{owner}/{repo}']['response']

// checks GitHub to ensure that the given repository name is unique
// displays a success message if the name is available
// warns the user if the name is taken
export const UniqueRepoName: React.FC<{
  repositoryOwner?: string // i.e. `trouble`
  initialValue?: string
}> = props => {
  const { repositoryOwner, initialValue = 'main' } = props
  const [value, setValue] = React.useState(initialValue)
  const debouncedValue = useDebounce(value, 200)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isRequesting = useRef<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const [isValid, setIsValid] = React.useState<boolean | undefined>(undefined)

  useEffect(() => {
    let timer: NodeJS.Timeout

    // run this effect as few times as possible by using the debounced value
    // use a ref to prevent duplicative requests as dependencies of this effect update
    if (debouncedValue && isRequesting.current !== debouncedValue && repositoryOwner) {
      isRequesting.current = debouncedValue

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
              route: `GET /repos/${repositoryOwner}/${debouncedValue}`,
            }),
          })

          clearTimeout(timer)
          const repoRes: GitHubResponse = await repoReq.json()
          setIsValid(repoRes.status !== 200)
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

  let description = 'This value must be unique'
  if (error) description = error
  if (value && isValid === false)
    description = `'${value}' is not available. Please choose another.`
  if (value && isValid) description = `'${value}' is available`

  return (
    <div>
      <Text
        label="Repository name"
        path="repositoryName"
        initialValue={initialValue}
        value={value}
        onChange={setValue}
        placeholder="Choose the name of your repository"
        required
        showError={Boolean(error || !isValid)}
        loading={isLoading}
      />
      <div
        className={[classes.description, (error || !isValid) && !isLoading && classes.error]
          .filter(Boolean)
          .join(' ')}
      >
        {description}
      </div>
    </div>
  )
}
