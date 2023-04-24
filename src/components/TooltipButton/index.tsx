import * as React from 'react'

import Tooltip from '@components/Tooltip'

import classes from './index.module.scss'

type TooltipButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  text: string
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

  const handleOnClick = React.useCallback(
    async e => {
      if (typeof onClick === 'function') await onClick(e)
    },
    [onClick],
  )

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
