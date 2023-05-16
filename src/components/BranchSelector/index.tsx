import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import Label from '@forms/Label'
import type { Endpoints } from '@octokit/types'

import { LoadingShimmer } from '@components/LoadingShimmer'
import { Project } from '@root/payload-cloud-types'

type GitHubResponse = Endpoints['GET /repos/{owner}/{repo}/branches']['response']

export const BranchSelector: React.FC<{
  repositoryFullName: Project['repositoryFullName']
  initialValue?: string
}> = props => {
  const { repositoryFullName, initialValue = 'main' } = props
  const [branches, setBranches] = useState<string[]>([])
  // if we know the `repositoryFullName` then we need to load their branches
  // otherwise, we render a text field for the user to explicitly define
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(repositoryFullName))
  const isRequesting = useRef(false)

  useEffect(() => {
    if (repositoryFullName && !isRequesting.current) {
      isRequesting.current = true
      setIsLoading(true)

      const owner = repositoryFullName?.split('/')?.[0]
      const repo = repositoryFullName?.split('/')?.[1]

      const getBranches = async () => {
        try {
          const branchesReq = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                route: `GET /repos/${owner}/${repo}/branches`,
              }),
            },
          )

          const branchesRes: GitHubResponse = await branchesReq.json()

          if (branchesRes?.data?.length > 0) {
            setBranches(branchesRes.data.map((branch: any) => branch.name))
          }

          setIsLoading(false)
          isRequesting.current = false
        } catch (err: unknown) {
          setIsLoading(false)
          isRequesting.current = false
        }
      }

      getBranches()
    }
  }, [repositoryFullName])

  if (isLoading) {
    return (
      <div>
        <Label label="Branch to deploy" />
        <LoadingShimmer />
      </div>
    )
  }

  return (
    <Fragment>
      {branches?.length > 0 ? (
        <Select
          label="Branch to deploy"
          path="deploymentBranch"
          options={branches?.map(branch => ({
            label: branch,
            value: branch,
          }))}
          required
          initialValue={initialValue || branches[0]}
        />
      ) : (
        <Text
          label="Branch to deploy"
          path="deploymentBranch"
          placeholder="main"
          initialValue={initialValue}
          required
        />
      )}
    </Fragment>
  )
}
