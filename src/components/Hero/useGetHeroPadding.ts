import type { PaddingProps, Settings } from '@components/BlockWrapper/index.js'
import type { BlocksProp } from '@components/RenderBlocks/index.js'
import type { Page } from '@root/payload-types.js'
import type { Theme } from '@root/providers/Theme/types.js'

import { getFieldsKeyFromBlock } from '@components/RenderBlocks/utilities.js'
import { useThemePreference } from '@root/providers/Theme/index.js'
import { useEffect, useMemo, useState } from 'react'

export const useGetHeroPadding = (
  theme: Page['hero']['theme'],
  block?: BlocksProp,
): PaddingProps => {
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Theme>()

  useEffect(() => {
    if (themeFromContext) {
      setThemeState(themeFromContext)
    }
  }, [themeFromContext])

  const padding = useMemo((): PaddingProps => {
    const topPadding: PaddingProps['top'] = 'hero'
    let bottomPadding: PaddingProps['bottom'] = 'large'

    if (!block) {
      return { bottom: bottomPadding, top: topPadding }
    }

    const blockKey = getFieldsKeyFromBlock(block)
    const blockSettings: Settings = block[blockKey]?.settings

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
      bottom: bottomPadding,
      top: topPadding,
    }
  }, [themeState, theme, block])

  return padding
}
