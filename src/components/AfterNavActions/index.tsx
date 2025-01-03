'use client'

import React from 'react'

import SyncDocsButton from '@components/SyncDocsButton'
import SyncCommunityHelp from '@components/SyncCommunityHelp'
import RedeployButton from '@components/RedeployButton'

import './index.scss'

const baseClass = 'after-nav-actions'

const AfterNavActions: React.FC = () => {
  return (
    <div className={baseClass}>
      <span className={`${baseClass}__group-title`}>Admin Actions</span>
      <SyncDocsButton />
      <SyncCommunityHelp />
      <RedeployButton />
    </div>
  )
}

export default AfterNavActions
