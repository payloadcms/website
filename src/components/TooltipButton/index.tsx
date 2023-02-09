import * as React from 'react'

import Tooltip from '@components/Tooltip'

import classes from './index.module.scss'

type TooltipButtonProps = {
  text: string
  onClick: () => void | Promise<void>
  children: React.ReactNode
  className?: string
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
      setIsVisible: (isActive: boolean) => void
    }
)
export const TooltipButton: React.FC<TooltipButtonProps> = ({
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

  const handleOnClick = React.useCallback(async () => {
    await onClick()
  }, [onClick])

  return (
    <button
      onFocus={() => onFocusChange('enter')}
      onBlur={() => onFocusChange('leave')}
      onMouseEnter={() => onFocusChange('enter')}
      onMouseLeave={() => onFocusChange('leave')}
      className={[classes.tooltipButton, show && classes.show, className].filter(Boolean).join(' ')}
      type="button"
      onClick={handleOnClick}
    >
      {children}

      <Tooltip className={classes.tip}>{text}</Tooltip>
    </button>
  )
}
