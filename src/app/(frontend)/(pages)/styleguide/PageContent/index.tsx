import { BlockSpacing } from '@components/BlockSpacing/index.js'
import { Gutter } from '@components/Gutter/index.js'
import React from 'react'

import { StyleguideBreadcrumbs } from './Breadcrumbs/index.js'
import { RenderDarkMode } from './RenderDarkMode/index.js'

export const StyleguidePageContent: React.FC<{
  children: React.ReactNode
  darkModeMargins?: boolean
  darkModePadding?: boolean
  renderHeader?: boolean
  title?: string
}> = ({ children, darkModeMargins, darkModePadding, renderHeader = true, title }) => {
  return (
    <div>
      {renderHeader && (
        <BlockSpacing top={false}>
          <Gutter>
            <StyleguideBreadcrumbs pageTitle={title} />
            <h1>{title || 'Page Title'}</h1>
          </Gutter>
        </BlockSpacing>
      )}
      {children}
      <RenderDarkMode enableMargins={darkModeMargins} enablePadding={darkModePadding}>
        {children}
      </RenderDarkMode>
    </div>
  )
}
