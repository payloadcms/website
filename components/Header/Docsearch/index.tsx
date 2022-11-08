import React from 'react'
import dynamic from 'next/dynamic'

const Component = dynamic(() => import('./Component'), {
  suspense: true,
})

export const DocSearch: React.FC = () => {
  return (
    <React.Suspense>
      <Component />
    </React.Suspense>
  )
}
