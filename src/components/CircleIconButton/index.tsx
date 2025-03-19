import { CloseIcon } from '@root/icons/CloseIcon/index'
import { PlusIcon } from '@root/icons/PlusIcon/index'
import React from 'react'

import classes from './index.module.scss'

const icons = {
  add: PlusIcon,
  close: CloseIcon,
}

export const CircleIconButton: React.FC<{
  className?: string
  icon?: 'add' | 'close'
  label: string
  onClick: () => void
}> = ({ children, ...props }: any) => {
  const { className, icon = 'add', label, onClick } = props

  const Icon = icons[icon]

  return (
    <button
      className={[classes.button, className].filter(Boolean).join(' ')}
      onClick={onClick}
      type="button"
    >
      <div className={classes.iconWrapper}>{Icon && <Icon size="full" />}</div>
      <span className={classes.label}>{label}</span>
    </button>
  )
}
