'use client'

import type { Budget, Industry, Partner, Region, Specialty } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import { PartnerGrid } from '@components/PartnerGrid'
import { ChevronDownIcon } from '@root/icons/ChevronDownIcon'
import { CloseIcon } from '@root/icons/CloseIcon'
import { useEffect, useState } from 'react'

import classes from './index.module.scss'

type FilterablePartner = {
  budgets: string[]
  industries: string[]
  regions: string[]
  specialties: string[]
} & Omit<Partner, 'budgets' | 'industries' | 'regions' | 'specialties'>

export const PartnerDirectory: React.FC<{
  filterOptions: {
    budgets: Budget[]
    industries: Industry[]
    regions: Region[]
    specialties: Specialty[]
  }
  partnerList: FilterablePartner[]
}> = (props) => {
  const { filterOptions, partnerList } = props

  const [filters, setFilters] = useState<{
    budgets: string[]
    industries: string[]
    regions: string[]
    specialties: string[]
  }>({
    budgets: [],
    industries: [],
    regions: [],
    specialties: [],
  })

  const [openFilters, setOpenFilters] = useState<boolean>(false)

  const [filteredPartners, setFilteredPartners] = useState<FilterablePartner[]>(partnerList)

  const [validFilters, setValidFilters] = useState<{
    budgets: string[]
    industries: string[]
    regions: string[]
    specialties: string[]
  }>({
    budgets: [],
    industries: [],
    regions: [],
    specialties: [],
  })

  useEffect(() => {
    setFilteredPartners(
      partnerList.filter((partner) => {
        return (
          (filters.industries.length === 0 ||
            filters.industries.every((industry) => partner.industries.includes(industry))) &&
          (filters.specialties.length === 0 ||
            filters.specialties.every((specialty) => partner.specialties.includes(specialty))) &&
          (filters.regions.length === 0 ||
            filters.regions.every((region) => partner.regions.includes(region))) &&
          (filters.budgets.length === 0 ||
            filters.budgets.every((budget) => partner.budgets.includes(budget)))
        )
      }),
    )
  }, [filters, partnerList])

  useEffect(() => {
    const filterSet: {
      budgets: string[]
      industries: string[]
      regions: string[]
      specialties: string[]
    } = {
      budgets: [],
      industries: [],
      regions: [],
      specialties: [],
    }

    filteredPartners.forEach((partner) => {
      filterSet.industries.push(...partner.industries)
      filterSet.specialties.push(...partner.specialties)
      filterSet.regions.push(...partner.regions)
      filterSet.budgets.push(...partner.budgets)
    })

    filterSet.industries = Array.from(new Set(filterSet.industries))
    filterSet.specialties = Array.from(new Set(filterSet.specialties))
    filterSet.regions = Array.from(new Set(filterSet.regions))
    filterSet.budgets = Array.from(new Set(filterSet.budgets))

    setValidFilters(filterSet)
  }, [filteredPartners])

  const hasFilters = Object.values(filters).some((filter) => filter.length > 0)

  const handleFilters = (
    group: 'budgets' | 'industries' | 'regions' | 'specialties',
    filter: string,
    checked: boolean,
  ) => {
    setFilters((prev) => {
      return {
        ...prev,
        [group]: checked ? [...prev[group], filter] : prev[group].filter((f) => f !== filter),
      }
    })
  }

  const handleReset = () => {
    setFilters({
      budgets: [],
      industries: [],
      regions: [],
      specialties: [],
    })
  }

  const toggleFilterGroup = () => {
    setOpenFilters(!openFilters)
  }

  return (
    <BlockWrapper settings={{ theme: 'dark' }}>
      <Gutter className={['grid', classes.partnerDirectory].join(' ')}>
        <div className={['cols-16', classes.directoryHeader].join(' ')}>
          <h2>All Partners</h2>
          <h4>
            {filteredPartners.length} result{filteredPartners.length === 1 ? '' : 's'}
          </h4>
        </div>
        <div className={['cols-4 cols-m-8', classes.sidebar].join(' ')}>
          <div className={classes.filterHeader}>
            <button
              aria-label="Show Filters"
              className={classes.filterToggle}
              onClick={() => toggleFilterGroup()}
            >
              <CloseIcon className={openFilters ? classes.openToggle : ''} />
            </button>
            <span>Filters</span>
            <button disabled={!hasFilters} onClick={() => handleReset()}>
              Clear
            </button>
          </div>
          <div
            className={[classes.filterWrapper, openFilters ? classes.openFilters : '']
              .filter(Boolean)
              .join(' ')}
          >
            <FilterGroup
              filters={filters['industries']}
              group={'industries'}
              handleFilters={handleFilters}
              options={filterOptions['industries']}
              validOptions={validFilters.industries}
            />
            <FilterGroup
              filters={filters['specialties']}
              group={'specialties'}
              handleFilters={handleFilters}
              options={filterOptions['specialties']}
              validOptions={validFilters.specialties}
            />
            <FilterGroup
              filters={filters['regions']}
              group={'regions'}
              handleFilters={handleFilters}
              options={filterOptions['regions']}
              validOptions={validFilters.regions}
            />
            <FilterGroup
              filters={filters['budgets']}
              group={'budgets'}
              handleFilters={handleFilters}
              options={filterOptions['budgets']}
              validOptions={validFilters.budgets}
            />
          </div>
        </div>
        <div className="cols-12">
          <PartnerGrid partners={filteredPartners} />
        </div>
      </Gutter>
      <BackgroundGrid zIndex={0} />
    </BlockWrapper>
  )
}

const FilterGroup: React.FC<{
  filters: string[]
  group: 'budgets' | 'industries' | 'regions' | 'specialties'
  handleFilters: (
    group: 'budgets' | 'industries' | 'regions' | 'specialties',
    filter: string,
    checked: boolean,
  ) => void
  options: (Budget | Industry | Region | Specialty)[]
  validOptions?: string[]
}> = (props) => {
  const { filters, group, handleFilters, options, validOptions } = props

  const [open, setOpen] = useState(true)

  return (
    <div className={[classes.filterGroup, open ? classes.open : ''].filter(Boolean).join(' ')}>
      <button
        className={classes.filterGroupHeader}
        onClick={() => {
          setOpen(!open)
        }}
      >
        {group.charAt(0).toUpperCase() + group.slice(1) + ' '}
        {filters.length > 0 && <div className={classes.pill}>{filters.length}</div>}
        <ChevronDownIcon className={classes.chevron} size="small" />
      </button>
      <div className={classes.checkboxes}>
        {options
          .sort((a, b) => a.value.localeCompare(b.value))
          .map((option) => (
            <label key={option.id}>
              <input
                checked={filters.includes(option.value)}
                disabled={validOptions?.includes(option.value) ? false : true}
                name={option.value}
                onChange={(e) => handleFilters(group, option.value, e.target.checked)}
                type="checkbox"
              />
              {option.name}
            </label>
          ))}
      </div>
    </div>
  )
}
