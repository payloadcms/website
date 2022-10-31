import Link from 'next/link'
import React from 'react'

export const StyleguideBreadcrumbs: React.FC<{
  pageTitle: string
  pageSlug: string
}> = ({ pageTitle, pageSlug }) => {
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
      <Link href={`/styleguide/${pageSlug}`}>{pageTitle}</Link>
    </div>
  )
}
