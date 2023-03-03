import { AlgoliaSearchBox } from '@root/adapters/AlgoliaSearchBox'
import { FilterIcon } from '@root/graphics/FilterIcon'
import { SearchIconV2 } from '@root/graphics/SearchIconV2'
import React from 'react'
import classes from './index.module.scss'

export const ArchiveSearchBar: React.FC<{ className: string }> = ({ className }) => {
  return (
    <div className={[classes.filterBar, className].filter(Boolean).join(' ')}>
      <div className={classes.searchIcon}>
        <SearchIconV2 />
      </div>
      <AlgoliaSearchBox className={classes.searchInput} />
      <div className={classes.filterIcon}>
        <FilterIcon />
      </div>
    </div>
  )
}
