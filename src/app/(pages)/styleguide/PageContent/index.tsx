import React from 'react'

import { BlockSpacing } from '../../../../components/BlockSpacing'
import { Gutter } from '../../../../components/Gutter'
import { StyleguideBreadcrumbs } from './Breadcrumbs'
import { RenderDarkMode } from './RenderDarkMode'

export const StyleguidePageContent: React.FC<{
  title?: string
  children: React.ReactNode
  darkModePadding?: boolean
  darkModeMargins?: boolean
  renderHeader?: boolean
}> = ({ title, children, darkModePadding, darkModeMargins, renderHeader = true }) => {
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
