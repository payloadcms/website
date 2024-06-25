import React from 'react'
import Link from 'next/link.js'

export const StyleguideBreadcrumbs: React.FC<{
  pageTitle?: string
}> = ({ pageTitle }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Link href="/styleguide">Styleguide</Link>
      &nbsp;{'>'}&nbsp;
      <span>{pageTitle}</span>
    </div>
  )
}
