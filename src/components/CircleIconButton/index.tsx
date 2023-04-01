import React from 'react'

import { PlusIcon } from '@root/icons/PlusIcon'

import classes from './index.module.scss'

export const CircleIconButton: React.FC<{
  className?: string
  onClick: () => void
  label: string
}> = ({ children, ...props }: any) => {
  const { onClick, className, label, ...rest } = props

  return (
    <button
      className={[classes.button, className].filter(Boolean).join(' ')}
      type="button"
      onClick={onClick}
    >
      <div className={classes.iconWrapper}>
        <PlusIcon className={classes.icon} />
      </div>
      <span className={classes.label}>{label}</span>
    </button>
  )
}
