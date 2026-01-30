import { CheckIcon } from '@root/icons/CheckIcon/index'
import { CloseIcon } from '@root/icons/CloseIcon/index'
import React from 'react'

import './index.scss'

interface BulletListItem {
  icon: 'check' | 'x'
  text: string
}

interface BulletListProps {
  items: BulletListItem[]
}

export const BulletList: React.FC<BulletListProps> = ({ items }) => {
  return (
    <div className="bullet-list-wrapper">
      <ul className="bullet-list">
        {items.map((item, index) => (
          <li className={`bullet-list__item bullet-list__item--${item.icon}`} key={index}>
            <span className="bullet-list__icon">
              {item.icon === 'check' ? <CheckIcon /> : <CloseIcon />}
            </span>
            <span className="bullet-list__text">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
