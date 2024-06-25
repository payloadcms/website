import { useEffect, useMemo, useState } from 'react'

import type { PaddingProps, Settings } from '@components/BlockWrapper/index.js'
import type { BlocksProp } from '@components/RenderBlocks/index.js'
import { getFieldsKeyFromBlock } from '@components/RenderBlocks/utilities.js'
import type { Page } from '@root/payload-types.js'
import { useThemePreference } from '@root/providers/Theme/index.js'
import type { Theme } from '@root/providers/Theme/types.js'

export const useGetHeroPadding = (
  theme: Page['hero']['theme'],
  block?: BlocksProp,
): PaddingProps => {
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Theme>()

  useEffect(() => {
    if (themeFromContext) setThemeState(themeFromContext)
  }, [themeFromContext])

  const padding = useMemo((): PaddingProps => {
    let topPadding: PaddingProps['top'] = 'hero'
    let bottomPadding: PaddingProps['bottom'] = 'large'

    if (!block) return { top: topPadding, bottom: bottomPadding }

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
