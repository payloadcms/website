/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import './index.scss'

const baseClass = 'rich-text-spotlight'

const SpotlightElement: React.FC<{
  attributes: any
  element: any
  children: React.ReactNode
  path: string
}> = ({ attributes, children, path, ...props }) => {
  const Element = props.element.element ?? 'p'

  return (
    <div className={`${baseClass}--wrapper`}>
      <div contentEditable={false} className={`${baseClass}--header`}>
        Spotlight animation ({props.element.element ?? 'p'})
      </div>
      <span className={baseClass}>
        <Element {...attributes}>{children}</Element>
      </span>
    </div>
  )
}

export default SpotlightElement
