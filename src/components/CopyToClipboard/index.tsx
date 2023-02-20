import * as React from 'react'

import { TooltipButton } from '@components/TooltipButton'
import Copy from '@root/icons/Copy'

import classes from './index.module.scss'

type CopyToClipboardProps = {
  value: (() => Promise<string>) | string
  className?: string
}
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ value, className }) => {
  const [copied, setCopied] = React.useState(false)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const ref = React.useRef<any>(null)

  const copy = React.useCallback(async () => {
    if (ref && ref.current) {
      const copyValue = typeof value === 'string' ? value : await value()
      ref.current.value = copyValue
      ref.current.select()
      ref.current.setSelectionRange(0, copyValue.length + 1)
      document.execCommand('copy')

      setCopied(true)
    }
  }, [value])

  React.useEffect(() => {
    if (copied && !showTooltip) {
      setTimeout(() => {
        setCopied(false)
      }, 500)
    }
  }, [copied, showTooltip])

  return (
    <TooltipButton
      onClick={copy}
      text={copied ? 'copied' : 'copy'}
      setIsVisible={setShowTooltip}
      isVisible={showTooltip || copied}
      className={className}
    >
      <Copy />

      <textarea className={classes.copyTextarea} tabIndex={-1} readOnly ref={ref} />
    </TooltipButton>
  )
}
