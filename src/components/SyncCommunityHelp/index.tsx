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
    try {
      setIsSyncing(true)

      const res = await fetch(`${api}/sync-ch`)

      if (!res.ok) {
        let errorMessage = 'Failed to sync community help'
        try {
          const data = await res.json()
          errorMessage += `: ${data?.message || 'Unknown error'}`
        } catch (error) {
          errorMessage += ': Unable to parse error response.'
        }
        toast.error(errorMessage)
        return
      }

      toast.success('Community help threads synced successfully')
    } catch (error) {
      console.error('Sync failed:', error)
      toast.error('An error occurred while syncing community help. Please try again.')
    }
    setIsSyncing(false)
  }

  return (
    <button className={baseClass} disabled={isSyncing} onClick={syncCommunityHelp} type="button">
      {isSyncing ? 'Syncing...' : 'Sync Community Help'}
    </button>
  )
}

export default SyncCommunityHelp
