import React from 'react'

import './index.scss'

interface PillProps {
  text: string
}

export const Pill: React.FC<PillProps> = ({ text }) => {
  return <div className="rich-text-pill">{text}</div>
}
