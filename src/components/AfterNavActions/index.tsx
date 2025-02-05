'use client'

import RedeployButton from '@components/RedeployButton'
import RefreshMdxToLexicalButton from '@components/RefreshMdxToLexicalButton'
import SyncCommunityHelp from '@components/SyncCommunityHelp'
import SyncDocsButton from '@components/SyncDocsButton'
import SyncToAlgolia from '@components/SyncToAlgolia'
import React from 'react'

import './index.scss'

const baseClass = 'after-nav-actions'

const AfterNavActions: React.FC = () => {
  return (
    <div className={baseClass}>
      <span className={`${baseClass}__group-title`}>Admin Actions</span>
      <SyncDocsButton />
      <RefreshMdxToLexicalButton />
      <RedeployButton />

      <SyncCommunityHelp />
      <SyncToAlgolia />
    </div>
  )
}

export default AfterNavActions
