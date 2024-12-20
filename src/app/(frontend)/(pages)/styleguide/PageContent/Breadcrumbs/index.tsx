import Link from 'next/link'
import React from 'react'

export const StyleguideBreadcrumbs: React.FC<{
  pageTitle?: string
}> = ({ pageTitle }) => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      <Link href="/styleguide">Styleguide</Link>
      &nbsp;{'>'}&nbsp;
      <span>{pageTitle}</span>
    </div>
  )
}
