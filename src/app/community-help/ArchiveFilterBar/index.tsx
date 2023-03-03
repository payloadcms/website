import { AlgoliaSearchBox } from '@root/adapters/AlgoliaSearchBox'
import { SearchIcon } from '@root/icons/SearchIcon'
import React from 'react'
import classes from './index.module.scss'

export const ArchiveSearchBar: React.FC = () => {
  return (
    <div className={classes.filterBar}>
      <div className={classes.searchIcon}>
        <SearchIcon bold />
      </div>
      <AlgoliaSearchBox className={classes.searchInput} />
    </div>
  )
}
