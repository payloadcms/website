import React from 'react'
import dynamic from 'next/dynamic'

const Input = dynamic(() => import('./Input'), {
  suspense: true,
})

export function Phone(props) {
  return (
    <React.Suspense>
      <Input {...props} />
    </React.Suspense>
  )
}
