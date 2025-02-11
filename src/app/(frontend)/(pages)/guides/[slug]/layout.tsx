import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index.js'
import React from 'react'

export default async ({ children }) => {
  return (
    <React.Fragment>
      <BreadcrumbsBar breadcrumbs={[]} hero={{ type: 'default' }} />
      {children}
    </React.Fragment>
  )
}
