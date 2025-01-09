'use client'

import RedeployButton from '@components/RedeployButton'
import RefreshMdxToLexicalButton from '@components/RefreshMdxToLexicalButton'
import SyncCommunityHelp from '@components/SyncCommunityHelp'
import SyncDocsButton from '@components/SyncDocsButton'

import './index.scss'

import React from 'react'

const baseClass = 'after-nav-actions'

const AfterNavActions: React.FC = () => {
  return (
    <div className={baseClass}>
      <span className={`${baseClass}__group-title`}>Admin Actions</span>
      <SyncDocsButton />
      <RefreshMdxToLexicalButton />
      <SyncCommunityHelp />
      <RedeployButton />
    </div>
  )
}

export default AfterNavActions
