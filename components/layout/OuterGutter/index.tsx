import React from 'react'
import { MaxWidth } from '../MaxWidth'

export const OuterGutter: React.FC<{ children: React.ReactNode }> = props => {
  return (
    <MaxWidth>
      <div style={{ margin: '0 var(--outer-gutter-h)' }}>{props.children}</div>
    </MaxWidth>
  )
}
