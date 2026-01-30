import React from 'react'

import './index.scss'

interface BulletListItem {
  text: string
  icon: 'check' | 'x'
}

interface BulletListProps {
  items: BulletListItem[]
}

export const BulletList: React.FC<BulletListProps> = ({ items }) => {
  return (
    <div className="bullet-list-wrapper">
      <ul className="bullet-list">
        {items.map((item, index) => (
          <li key={index} className={`bullet-list__item bullet-list__item--${item.icon}`}>
            <span className="bullet-list__icon">{item.icon === 'check' ? '✓' : '✕'}</span>
            <span className="bullet-list__text">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
