import * as React from 'react'

import { TooltipContent } from '@components/Tooltip/TooltipContent/index.js'

import classes from './index.module.scss'

type TooltipProps = React.HTMLAttributes<HTMLButtonElement> & {
  text: React.ReactNode
  children: React.ReactNode
} & (
    | {
        isVisible?: never
        setIsVisible?: never
      }
    | {
        /**
         * If this is set, the button will not manage its own state
         */
        isVisible: boolean
        setIsVisible: (isActive: boolean) => void // eslint-disable-line no-unused-vars
      }
  )

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  className,
  text,
  onClick,
  isVisible: isActive,
  setIsVisible: setIsActive,
}) => {
  const [isVisibleInternal, setIsVisibleInternal] = React.useState(false)
  const hoistControl = typeof setIsActive === 'function'
  const show = hoistControl ? isActive : isVisibleInternal

  const onFocusChange = React.useCallback(
    (dir: string) => {
      const nowActive = dir === 'enter'

      if (hoistControl) {
        setIsActive(nowActive)
      } else {
        setIsVisibleInternal(nowActive)
      }
    },
    [setIsActive, hoistControl],
  )

  return (
    <button
      onFocus={() => onFocusChange('enter')}
      onBlur={() => onFocusChange('leave')}
      onMouseEnter={() => {
        onFocusChange('enter')
      }}
      onMouseLeave={() => {
        onFocusChange('leave')
      }}
      className={[classes.tooltip, show && classes.show, className].filter(Boolean).join(' ')}
      type="button"
      onClick={onClick}
    >
      {children}
      <TooltipContent className={classes.tip}>{text}</TooltipContent>
    </button>
  )
}
