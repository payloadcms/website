'use client'

import { toast, useConfig } from '@payloadcms/ui'
import React, { useState } from 'react'

import './index.scss'

const baseClass = 'refresh-docs-button'

const RefreshMdxToLexicalButton: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {
    config: {
      routes: { api },
    },
  } = useConfig()

  const refreshDocs = async () => {
    setIsRefreshing(true)
    const res = await fetch(`${api}/refresh/mdx-to-lexical`)
    if (res.ok) {
      toast.success('Documentation refreshed successfully')
      setIsRefreshing(false)
    } else {
      const data = await res.json()
      toast.error(`Failed to refresh documentation: ${data.message}`)
      setIsRefreshing(false)
    }
  }

  return (
    <button className={baseClass} disabled={isRefreshing} onClick={refreshDocs} type="button">
      {isRefreshing ? 'Refreshing...' : 'Refresh MDX to Lexical'}
    </button>
  )
}

export default RefreshMdxToLexicalButton
