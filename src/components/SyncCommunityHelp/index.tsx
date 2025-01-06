'use client'

import { toast, useConfig } from '@payloadcms/ui'
import React, { useState } from 'react'

import './index.scss'

const baseClass = 'sync-ch-button'

const SyncCommunityHelp: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const {
    config: {
      routes: { api },
    },
  } = useConfig()

  const syncCommunityHelp = async () => {
    setIsSyncing(true)
    const res = await fetch(`${api}/sync-ch`)
    if (res.ok) {
      toast.success('Community help threads synced successfully')
      setIsSyncing(false)
    } else {
      const data = await res.json()
      toast.error(`Failed to sync community help: ${data.message}`)
      setIsSyncing(false)
    }
  }

  return (
    <button className={baseClass} disabled={isSyncing} onClick={syncCommunityHelp}>
      {isSyncing ? 'Syncing...' : 'Sync Community Help'}
    </button>
  )
}

export default SyncCommunityHelp
