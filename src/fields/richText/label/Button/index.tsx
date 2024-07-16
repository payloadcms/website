/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line no-use-before-define
import React from 'react'
import { ElementButton } from '@payloadcms/richtext-slate'

import './index.scss'

const baseClass = 'rich-text-label-button'

const ToolbarButton: React.FC<{ path: string }> = () => (
  <ElementButton format="label">
    <div className={baseClass}>label</div>
  </ElementButton>
)

export default ToolbarButton
