import { useEffect, useMemo, useState } from 'react'

import type { PaddingProps, Settings } from '@components/BlockWrapper'
import type { BlocksProp } from '@components/RenderBlocks'
import { getFieldsKeyFromBlock } from '@components/RenderBlocks/utilities'
import type { Page } from '@root/payload-types'
import { useThemePreference } from '@root/providers/Theme'
import type { Theme } from '@root/providers/Theme/types'

export const useGetHeroPadding = (
  block: BlocksProp,
  theme: Page['hero']['theme'],
): PaddingProps => {
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Theme>()

  useEffect(() => {
    if (themeFromContext) setThemeState(themeFromContext)
  }, [themeFromContext])

  const padding = useMemo((): PaddingProps => {
    let topPadding: PaddingProps['top'] = 'small'
    let bottomPadding: PaddingProps['bottom'] = 'large'

    let blockKey = getFieldsKeyFromBlock(block)
    let blockSettings: Settings = block[blockKey]?.settings

    if (theme) {
      // Compare with the block value otherwise compare with theme context
      if (blockSettings) {
        bottomPadding = theme === blockSettings?.theme ? 'small' : 'large'
      } else {
        bottomPadding = theme === themeState ? 'small' : 'large'
      }
    } else {
      if (blockSettings) {
        bottomPadding = themeState === blockSettings?.theme ? 'small' : 'large'
      }
    }

    return {
      top: topPadding,
      bottom: bottomPadding,
    }
  }, [themeState, theme, block])

  return padding
}
