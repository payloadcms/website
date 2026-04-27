'use client'

import { Button, TextInput, toast, useConfig } from '@payloadcms/ui'
import React, { useState } from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  const [isLoadingLatest, setIsLoadingLatest] = useState(false)
  const [isLoadingSpecific, setIsLoadingSpecific] = useState(false)
  const [version, setVersion] = useState('')

  const {
    config: {
      routes: { api },
    },
  } = useConfig()

  const createPost = (versionOverride?: string) => {
    const isSpecific = Boolean(versionOverride)
    if (isSpecific) {
      setIsLoadingSpecific(true)
    } else {
      setIsLoadingLatest(true)
    }

    const promise = fetch(`${api}/create-release-post-from-admin`, {
      body: JSON.stringify(versionOverride ? { version: versionOverride } : {}),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to create release post')
      }
    })

    void toast.promise(promise, {
      error: (err: Error) => err.message,
      loading: 'Creating draft release post...',
      success: 'Draft release post created',
    })

    void promise.finally(() => {
      if (isSpecific) {
        setIsLoadingSpecific(false)
      } else {
        setIsLoadingLatest(false)
      }
    })
  }

  return (
    <div className={baseClass}>
      <h2 className={`${baseClass}__heading`}>Payload Release Notes</h2>
      <h4>
        Use this component to sync Payload release notes to a draft blog post assigned to the
        Release Notes category.
      </h4>
      <div className={`${baseClass}__actions`}>
        <Button
          buttonStyle="secondary"
          disabled={isLoadingLatest}
          onClick={() => createPost()}
          size="large"
        >
          Pull Latest Release
        </Button>
        <div className={`${baseClass}__specific`}>
          <TextInput
            onChange={(e) => setVersion((e as React.ChangeEvent<HTMLInputElement>).target.value)}
            path="version"
            placeholder="e.g. 3.1.0"
            value={version}
          />
          <Button
            buttonStyle="secondary"
            disabled={isLoadingSpecific || !version.trim()}
            onClick={() => createPost(version.trim())}
            size="large"
          >
            Pull Specific Release
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BeforeDashboard
