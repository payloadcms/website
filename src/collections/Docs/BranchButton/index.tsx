import type { CustomComponent, PayloadServerReactComponent } from 'payload'

import { ShimmerEffect } from '@payloadcms/ui'
import React from 'react'

import { fetchAllBranches } from './fetchAllBranches'
import { BranchButtonClient } from './index.client'

export const BranchButtonPromise: PayloadServerReactComponent<CustomComponent> = async (props) => {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    return <span>GitHub Access Token not set</span>
  }
  const { params, payload } = props

  const segments = params?.segments as string[]

  const documentID: string | undefined = segments?.length > 2 ? segments[2] : undefined

  if (!documentID) {
    return null
  }

  const doc = await payload.findByID({
    id: documentID,
    collection: 'docs',
    depth: 0,
  })

  // Fetch all branches from payloadcms/payload
  const branchesRequest = await fetchAllBranches()

  const branchNames: string[] = branchesRequest.map((branch) => branch.name)

  const branchQueryParam = props.searchParams?.branch

  let branch: null | string = (branchQueryParam as string) ?? null
  if (!branch) {
    if (doc.version === 'v3') {
      branch = 'main'
    } else if (doc.version === 'v2') {
      branch = '2.x'
    }
  }

  return <BranchButtonClient branch={branch} branchNames={branchNames} />
}

export const BranchButton: PayloadServerReactComponent<CustomComponent> = (props) => {
  return (
    <React.Suspense fallback={<ShimmerEffect height={40} width={300} />}>
      <BranchButtonPromise {...props} />
    </React.Suspense>
  )
}
