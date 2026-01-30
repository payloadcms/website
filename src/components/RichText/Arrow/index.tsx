import React from 'react'

import './index.scss'

interface ArrowProps {
  direction: 'up' | 'down' | 'left' | 'right'
}

const arrowIcons = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
}

export const Arrow: React.FC<ArrowProps> = ({ direction }) => {
  return <div className={`docs-arrow docs-arrow--${direction}`}>{arrowIcons[direction]}</div>
}
