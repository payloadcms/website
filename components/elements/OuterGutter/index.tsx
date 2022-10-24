import React from 'react'

export const OuterGutter: React.FC<{ children: React.ReactNode }> = props => {
  return <div style={{ margin: '0 var(--outer-gutter-h)' }}>{props.children}</div>
}
