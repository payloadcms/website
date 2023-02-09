import * as React from 'react'

import { TooltipButton } from '@components/TooltipButton'
import Copy from '@root/icons/Copy'
import useCopyToClipboard from '@root/utilities/use-copy-to-clipboard'

type CopyToClipboardProps = {
  value: (() => Promise<string>) | string
  className?: string
}
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ value, className }) => {
  const [copied, setCopied] = React.useState(false)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [, copyTextFn] = useCopyToClipboard()

  const copy = React.useCallback(async () => {
    const valueToCopy = typeof value === 'string' ? value : await value()
    copyTextFn(valueToCopy)
    setCopied(true)
  }, [value, copyTextFn])

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
    </TooltipButton>
  )
}
