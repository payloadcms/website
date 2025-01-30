import type { Endpoints } from '@octokit/types'
import type { Project } from '@root/payload-cloud-types.js'

import { LoadingShimmer } from '@components/LoadingShimmer/index.js'
import { Select } from '@forms/fields/Select/index.js'
import { Text } from '@forms/fields/Text/index.js'
import Label from '@forms/Label/index.js'
import React, { Fragment, useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { branchReducer } from './reducer.js'

type GitHubListBranchesResponse = Endpoints['GET /repos/{owner}/{repo}/branches']['response']
type GitHubFullRepoResponse = Endpoints['GET /repos/{owner}/{repo}']['response']

export const BranchSelector: React.FC<{
  initialValue?: string
  repositoryFullName: Project['repositoryFullName']
}> = (props) => {
  const { initialValue = 'main', repositoryFullName } = props

  const [page, dispatchPage] = useReducer((state: number, action: 'INCREMENT') => {
    switch (action) {
      case 'INCREMENT':
        return state + 1
      default:
        return state
    }
  }, 1)

  const [result, dispatchResult] = useReducer(branchReducer, {
    branches: [],
    defaultBranch: '',
  })

  // if we know the `repositoryFullName` then we need to load their branches
  // otherwise, we render a text field for the user to explicitly define
  const [isInitializing, setIsInitializing] = useState<boolean>(Boolean(repositoryFullName))
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(repositoryFullName))
  const [hasMore, setHasMore] = useState<boolean>(true)
  const hasInitialized = useRef(false)
  const isRequesting = useRef(false)

  const getBranches = useCallback(async () => {
    if (repositoryFullName && !isRequesting.current) {
      isRequesting.current = true
      setIsLoading(true)

      const owner = repositoryFullName?.split('/')?.[0]
      const repo = repositoryFullName?.split('/')?.[1]

      try {
        const branchesReq = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`,
          {
            body: JSON.stringify({
              route: `GET /repos/${owner}/${repo}/branches?page=${page}`,
            }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
        )

        const branchesRes: GitHubListBranchesResponse = await branchesReq.json()
        if (branchesRes?.data?.length > 0) {
          let defaultBranch = result?.defaultBranch

          if (!defaultBranch) {
            const fullRepo = await fetch(
              `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`,
              {
                body: JSON.stringify({
                  route: `GET /repos/${owner}/${repo}`,
                }),
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
              },
            )
            const fullRepoRes: GitHubFullRepoResponse = await fullRepo.json()
            defaultBranch = fullRepoRes.data.default_branch
          }

          dispatchResult({
            type: 'ADD',
            payload: {
              branches: branchesRes.data.map((branch) => branch.name),
              defaultBranch,
            },
          })
        }

        // The GitHub API returns no properties that indicate total count, current page, or total pages
        // So we need to keep track of the page number ourselves and assume `hasMore` based on the results
        setHasMore(branchesRes?.data?.length > 0)
        setIsLoading(false)
      } catch (err: unknown) {
        setIsLoading(false)
      }

      isRequesting.current = false
      setIsInitializing(false)
    }
  }, [repositoryFullName, page, result?.defaultBranch])

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      getBranches()
    }
  }, [getBranches])

  useEffect(() => {
    if (page > 1) {
      getBranches()
    }
  }, [page, getBranches])

  const onMenuScrollToBottom = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatchPage('INCREMENT')
    }
  }, [isLoading, hasMore])

  if (isInitializing) {
    return (
      <div>
        <Label label="Branch to deploy" />
        <LoadingShimmer />
      </div>
    )
  }

  return (
    <Fragment>
      {result?.branches?.length > 0 ? (
        <Select
          initialValue={initialValue ?? result?.defaultBranch}
          label="Branch to deploy"
          onMenuScrollToBottom={onMenuScrollToBottom}
          options={result?.branches?.map((branch) => ({
            label: branch,
            value: branch,
          }))}
          path="deploymentBranch"
          required
        />
      ) : (
        <Text
          initialValue={initialValue}
          label="Branch to deploy"
          path="deploymentBranch"
          placeholder="main"
          required
        />
      )}
    </Fragment>
  )
}
