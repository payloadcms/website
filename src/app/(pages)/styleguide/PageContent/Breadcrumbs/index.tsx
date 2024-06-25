import React from 'react'
import LinkImport from 'next/link.js'

const Link = (LinkImport.default || LinkImport) as unknown as typeof LinkImport.default

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
