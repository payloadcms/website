'use client'

import React from 'react'

export const UpdateTitle: React.FC<{ title: string }> = ({ title }) => {
  // Need this until Next #42414 is fixed
  React.useEffect(() => {
    document.title = title
  })
  return null
}
