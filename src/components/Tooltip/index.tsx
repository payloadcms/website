import { TooltipContent } from '@components/Tooltip/TooltipContent/index'
import * as React from 'react'

import classes from './index.module.scss'

type TooltipProps = {
  children: React.ReactNode
  text: React.ReactNode
  unstyled?: boolean
} & (
  | {
      /**
       * If this is set, the button will not manage its own state
       */
      isVisible: boolean
      setIsVisible: (isActive: boolean) => void
    }
  | {
      isVisible?: never
      setIsVisible?: never
    }
) &
  React.HTMLAttributes<HTMLButtonElement>

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  className,
  isVisible: isActive,
  onClick,
  setIsVisible: setIsActive,
  text,
  unstyled,
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
      className={[!unstyled && classes.tooltip, show && classes.show, className]
        .filter(Boolean)
        .join(' ')}
      onBlur={() => onFocusChange('leave')}
      onClick={onClick}
      onFocus={() => onFocusChange('enter')}
      onMouseEnter={() => {
        onFocusChange('enter')
      }}
      onMouseLeave={() => {
        onFocusChange('leave')
      }}
      type="button"
    >
      {children}
      <TooltipContent className={classes.tip}>{text}</TooltipContent>
    </button>
  )
}
