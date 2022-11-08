import React, { useEffect, useState, useRef } from 'react'
import Copy from '../icons/Copy'
import Tooltip from '../Tooltip'

import classes from './index.module.scss'

export type Props = {
  value?: string
  defaultMessage?: string
  successMessage?: string
  className?: string
}

const CopyToClipboard: React.FC<Props> = ({
  value,
  defaultMessage = 'copy',
  successMessage = 'copied',
  className,
}) => {
  const ref = useRef<any>(null)
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (copied && !hovered) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
  }, [copied, hovered])

  if (value) {
    return (
      <button
        onMouseEnter={() => {
          setHovered(true)
          setCopied(false)
        }}
        onMouseLeave={() => {
          setHovered(false)
        }}
        type="button"
        className={[classes.copyToClipboard, className && className].filter(Boolean).join(' ')}
        onClick={() => {
          if (ref && ref.current) {
            ref.current.select()
            ref.current.setSelectionRange(0, value.length + 1)
            document.execCommand('copy')

            setCopied(true)
          }
        }}
      >
        <Copy />
        <div
          className={[classes.tooltipWrapper, hovered || copied ? classes.showTooltip : ''].join(
            ' ',
          )}
        >
          <Tooltip>
            {copied && successMessage}
            {!copied && defaultMessage}
          </Tooltip>
        </div>
        <textarea readOnly value={value} ref={ref} />
      </button>
    )
  }

  return null
}

export default CopyToClipboard
