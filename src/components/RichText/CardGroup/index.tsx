import React from 'react'

import './index.scss'

interface CardGroupProps {
  children: React.ReactNode
}

export const CardGroup: React.FC<CardGroupProps> = ({ children }) => {
  return <div className="docs-card-group">{children}</div>
}
