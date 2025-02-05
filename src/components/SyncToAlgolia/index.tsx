'use client'

import { toast, useConfig } from '@payloadcms/ui'
import React, { useState } from 'react'

import './index.scss'

const baseClass = 'sync-algolia-button'

const SyncToAlgolia: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const {
    config: {
      routes: { api },
    },
  } = useConfig()

  const syncToAlgolia = async () => {
    try {
      setIsSyncing(true)

      const res = await fetch(`${api}/sync-algolia`)

      if (!res.ok) {
        let errorMessage = 'Failed to sync Algolia with Community Help'
        try {
          const data = await res.json()
          errorMessage += `: ${data?.message || 'Unknown error'}`
        } catch (error) {
          errorMessage += ': Unable to parse error response.'
        }
        toast.error(errorMessage)
        return
      }

      toast.success('Algolia synced with Community Help threads successfully')
    } catch (error) {
      console.error('Sync failed:', error)
      toast.error('An error occurred while syncing Algolia with community help. Please try again.')
    }
    setIsSyncing(false)
  }

  return (
    <button className={baseClass} disabled={isSyncing} onClick={syncToAlgolia} type="button">
      {isSyncing ? 'Syncing...' : 'Sync Algolia + Community Help'}
    </button>
  )
}

export default SyncToAlgolia
