import * as React from 'react'

import { TooltipButton } from '@components/TooltipButton'
import Copy from '@root/icons/Copy'
import useCopyToClipboard from '@root/utilities/use-copy-to-clipboard'

type CopyValueProps = {
  getValueToCopy: () => Promise<string>
}
export const CopyValue: React.FC<CopyValueProps> = ({ getValueToCopy }) => {
  const [copied, setCopied] = React.useState(false)
  const [tooltipText, setTooltipText] = React.useState<'copied' | 'copy'>('copy')
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [, copyTextFn] = useCopyToClipboard()

  const copy = React.useCallback(async () => {
    copyTextFn(await getValueToCopy())
    setCopied(true)
    setTooltipText('copied')
  }, [getValueToCopy, copyTextFn])

  React.useEffect(() => {
    if (copied && !showTooltip) {
      setCopied(false)
      setTimeout(() => {
        setTooltipText('copy')
      }, 300) // match tooltip transition-duration
    }
  }, [copied, showTooltip])

  return (
    <TooltipButton
      onClick={copy}
      text={tooltipText}
      setIsVisible={setShowTooltip}
      isVisible={showTooltip}
    >
      <Copy />
    </TooltipButton>
  )
}
