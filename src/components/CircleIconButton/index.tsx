import React from 'react'

import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import { PlusIcon } from '@root/icons/PlusIcon/index.js'

import classes from './index.module.scss'

const icons = {
  add: PlusIcon,
  close: CloseIcon,
}

export const CircleIconButton: React.FC<{
  className?: string
  onClick: () => void
  label: string
  icon?: 'add' | 'close'
}> = ({ children, ...props }: any) => {
  const { onClick, className, label, icon = 'add' } = props

  const Icon = icons[icon]

  return (
    <button
      className={[classes.button, className].filter(Boolean).join(' ')}
      type="button"
      onClick={onClick}
    >
      <div className={classes.iconWrapper}>{Icon && <Icon size="full" />}</div>
      <span className={classes.label}>{label}</span>
    </button>
  )
}
