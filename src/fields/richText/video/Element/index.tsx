/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react'
import { useFocused, useSelected } from 'slate-react'

import VideoIcon from '../Icon'

import './index.scss'

const baseClass = 'rich-text-video'

type Source = 'youtube' | 'vimeo'

const sourceLabels: Record<Source, string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
}

const Element = props => {
  const { attributes, children, element } = props
  const { source, id } = element
  const selected = useSelected()
  const focused = useFocused()
  const [title, setTitle] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (source !== 'youtube') {
        setTitle(`${sourceLabels[source]} Video: ${id}`)
        return
      }
      const data = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      )
      const json = await data.json()
      setTitle(json.title)
    }
    fetchData()
  }, [id, title, source])

  return (
    <div
      className={[baseClass, selected && focused && `${baseClass}--selected`]
        .filter(Boolean)
        .join(' ')}
      contentEditable={false}
      {...attributes}
    >
      {source === 'youtube' && (
        <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} style={{ maxWidth: '100%' }} />
      )}
      <div className={`${baseClass}__wrap`}>
        <div className={`${baseClass}__label`}>
          <VideoIcon />
          <div className={`${baseClass}__title`}>{title}</div>
        </div>
      </div>
      {children}
    </div>
  )
}

export default Element
