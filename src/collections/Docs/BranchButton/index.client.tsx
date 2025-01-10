'use client'

import { ReactSelect } from '@payloadcms/ui'

import './index.scss'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export const BranchButtonClient: React.FC<{ branch: null | string; branchNames: string[] }> = (
  args,
) => {
  const { branch, branchNames } = args
  const [selectedBranch, setSelectedBranch] = React.useState<null | string>(branch)
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <ReactSelect
      className="branch-select"
      isMulti={false}
      onChange={(selectedOption) => {
        if (Array.isArray(selectedOption)) {
          return
        }
        const newBranch = selectedOption?.value as string
        setSelectedBranch(newBranch)

        const newUrl = `${window.location.pathname}?branch=${newBranch}`
        window.location.href = newUrl
      }}
      options={branchNames.map((branchName) => ({
        label: branchName,
        value: branchName,
      }))}
      placeholder="Select a branch"
      value={selectedBranch ? { label: selectedBranch, value: selectedBranch } : undefined}
    />
  )
}
