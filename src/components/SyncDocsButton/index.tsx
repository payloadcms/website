'use client'

import { toast, useConfig } from '@payloadcms/ui'
import React, { useState } from 'react'

import './index.scss'

const baseClass = 'sync-docs-button'

const SyncDocsButton: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const {
    config: {
      routes: { api },
    },
  } = useConfig()

  const syncDocs = async () => {
    setIsSyncing(true)
    const res = await fetch(`${api}/sync/docs`)
    if (res.ok) {
      toast.success('Documentation synced successfully')
      setIsSyncing(false)
    } else {
      const data = await res.json()
      toast.error(`Failed to sync documentation: ${data.message}`)
      setIsSyncing(false)
    }
  }

  return (
    <button className={baseClass} disabled={isSyncing} onClick={syncDocs}>
      {isSyncing ? 'Syncing...' : 'Sync Docs'}
    </button>
  )
}

export default SyncDocsButton
