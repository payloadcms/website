import React from 'react'

import { AlgoliaSearchBox } from '@root/adapters/AlgoliaSearchBox'
import { SearchIconV2 } from '@root/graphics/SearchIconV2'
import { CrosshairIcon } from '@root/icons/CrosshairIcon'

import classes from './index.module.scss'

export const ArchiveSearchBar: React.FC<{ className: string }> = ({ className }) => {
  return (
    <div className={[classes.filterBar, className].filter(Boolean).join(' ')}>
      <AlgoliaSearchBox className={classes.searchInput} />
      <div className={classes.searchIcon}>
        <SearchIconV2 />
      </div>
    </div>
  )
}
