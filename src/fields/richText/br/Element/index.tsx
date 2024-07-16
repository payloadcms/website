import React from 'react'
import { useFocused, useSelected } from 'slate-react'

import './index.scss'

const baseClass = 'br'

type Source = 'youtube' | 'vimeo'

const sourceLabels: Record<Source, string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
}

const Element = props => {
  const { attributes, children, element } = props
  const selected = useSelected()
  const focused = useFocused()

  return (
    <div
      className={[baseClass, selected && focused && `${baseClass}--selected`]
        .filter(Boolean)
        .join(' ')}
      contentEditable={false}
      {...attributes}
    >
      <div className={`${baseClass}__wrap`}>
        <div className={`${baseClass}__label`}>Spacer</div>
      </div>
      {children}
    </div>
  )
}

export default Element
