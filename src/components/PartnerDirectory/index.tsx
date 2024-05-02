'use client'

import { useEffect, useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { Gutter } from '@components/Gutter'
import { PartnerGrid } from '@components/PartnerGrid'
import { ChevronDownIcon } from '@root/icons/ChevronDownIcon'
import type { Partner } from '@root/payload-types'
import { filterOptions } from './filterOptions'

import classes from './index.module.scss'

type PartnerDirectoryProps = {
  partners: Partner[]
}

export const PartnerDirectory = (props: PartnerDirectoryProps) => {
  const { partners } = props

  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])

  const [industryFilter, setIndustryFilter] = useState<Partner['industries']>([])
  const [technologyFilter, setTechnologyFilter] = useState<Partner['technologies']>([])
  const [regionFilter, setRegionFilter] = useState<Partner['regions']>([])
  const [budgetFilter, setBudgetFilter] = useState<Partner['budgets']>([])

  const [industryFiltersList, setIndustryFiltersList] = useState<Partner['industries']>([])
  const [technologyFiltersList, setTechnologyFiltersList] = useState<Partner['technologies']>([])
  const [regionFiltersList, setRegionFiltersList] = useState<Partner['regions']>([])
  const [budgetFiltersList, setBudgetFiltersList] = useState<Partner['budgets']>([])
  const [openFilters, setOpenFilters] = useState<
    ('industries' | 'technologies' | 'regions' | 'budgets')[]
  >(['industries'])

  // Add filters to the filter list
  useEffect(() => {
    setIndustryFiltersList(
      [...Array.from(new Set(partners.flatMap(partner => partner.industries)))].sort(),
    )
    setTechnologyFiltersList(
      [...Array.from(new Set(partners.flatMap(partner => partner.technologies)))].sort(),
    )
    setRegionFiltersList(
      [...Array.from(new Set(partners.flatMap(partner => partner.regions)))].sort(),
    )
    setBudgetFiltersList(
      [...Array.from(new Set(partners.flatMap(partner => partner.budgets)))].sort(),
    )
  }, [partners])

  // Filter partners based on selected filters when filters change
  useEffect(() => {
    setFilteredPartners(
      partners.filter(partner => {
        if (
          industryFilter.length &&
          !industryFilter.every(industry => partner.industries.includes(industry))
        ) {
          return false
        }
        if (
          technologyFilter.length &&
          !technologyFilter.every(technology => partner.technologies.includes(technology))
        ) {
          return false
        }
        if (
          regionFilter.length &&
          !regionFilter.every(region => partner.regions.includes(region))
        ) {
          return false
        }
        if (
          budgetFilter.length &&
          !budgetFilter.every(budget => partner.budgets.includes(budget))
        ) {
          return false
        }
        return true
      }),
    )
  }, [industryFilter, technologyFilter, regionFilter, budgetFilter, partners])

  // Toggle open filter group
  const toggleOpenGroup = (filter: 'industries' | 'technologies' | 'regions' | 'budgets') => {
    if (openFilters.includes(filter)) {
      setOpenFilters(openFilters.filter(openFilter => openFilter !== filter))
    } else {
      setOpenFilters([...openFilters, filter])
    }
  }

  // Handle filter change
  const handleFilterChange = (group, filter, checked) => {
    switch (group) {
      case 'industries':
        setIndustryFilter(
          checked
            ? [...industryFilter, filter]
            : industryFilter.filter(industry => industry !== filter),
        )
        break
      case 'technologies':
        setTechnologyFilter(
          checked
            ? [...technologyFilter, filter]
            : technologyFilter.filter(technology => technology !== filter),
        )
        break
      case 'regions':
        setRegionFilter(
          checked ? [...regionFilter, filter] : regionFilter.filter(region => region !== filter),
        )
        break
      case 'budgets':
        setBudgetFilter(
          checked ? [...budgetFilter, filter] : budgetFilter.filter(budget => budget !== filter),
        )
        break
    }
  }

  // Handle reset filters
  const handleReset = () => {
    setIndustryFilter([])
    setTechnologyFilter([])
    setRegionFilter([])
    setBudgetFilter([])
  }

  return (
    <Gutter className={['grid', classes.partnerDirectory].join(' ')}>
      <div className={['cols-16', classes.directoryHeader].join(' ')}>
        <h2>All Partners</h2>
        <div className={classes.results}>
          <button
            onClick={() => handleReset()}
            disabled={
              !industryFilter.length &&
              !technologyFilter.length &&
              !regionFilter.length &&
              !budgetFilter.length
            }
          >
            Clear Filters
          </button>
          <h5>
            {filteredPartners.length} result{filteredPartners.length === 1 ? '' : 's'}
          </h5>
        </div>
      </div>
      <div className={['cols-4', classes.sidebar].join(' ')}>
        <div className={classes.filterWrapper}>
          <div
            className={[classes.filterGroup, openFilters.includes('industries') ? classes.open : '']
              .filter(Boolean)
              .join(' ')}
          >
            <button
              className={classes.filterGroupHeader}
              onClick={() => toggleOpenGroup('industries')}
            >
              Industries{' '}
              {industryFilter.length > 0 && (
                <div className={classes.pill}>{industryFilter.length}</div>
              )}
              <ChevronDownIcon size="small" className={classes.chevron} />
            </button>
            <div className={classes.checkboxes}>
              {industryFiltersList.map(industry => (
                <label key={industry}>
                  <input
                    type="checkbox"
                    name={industry}
                    onChange={e => handleFilterChange('industries', industry, e.target.checked)}
                    checked={industryFilter.includes(industry)}
                  />
                  {filterOptions.industries[industry]}
                </label>
              ))}
            </div>
          </div>
          <div
            className={[
              classes.filterGroup,
              openFilters.includes('technologies') ? classes.open : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <button
              className={classes.filterGroupHeader}
              onClick={() => toggleOpenGroup('technologies')}
            >
              Technologies{' '}
              {technologyFilter.length > 0 && (
                <div className={classes.pill}>{technologyFilter.length}</div>
              )}
              <ChevronDownIcon size="small" className={classes.chevron} />
            </button>
            <div className={classes.checkboxes}>
              {technologyFiltersList.map(technology => (
                <label key={technology}>
                  <input
                    type="checkbox"
                    name={technology}
                    onChange={e => handleFilterChange('technologies', technology, e.target.checked)}
                    checked={technologyFilter.includes(technology)}
                  />
                  {filterOptions.technologies[technology]}
                </label>
              ))}
            </div>
          </div>
          <div
            className={[classes.filterGroup, openFilters.includes('regions') ? classes.open : '']
              .filter(Boolean)
              .join(' ')}
          >
            <button
              className={classes.filterGroupHeader}
              onClick={() => toggleOpenGroup('regions')}
            >
              Regions{' '}
              {regionFilter.length > 0 && <div className={classes.pill}>{regionFilter.length}</div>}
              <ChevronDownIcon size="small" className={classes.chevron} />
            </button>
            <div className={classes.checkboxes}>
              {regionFiltersList.map(region => (
                <label key={region}>
                  <input
                    type="checkbox"
                    name={region}
                    onChange={e => handleFilterChange('regions', region, e.target.checked)}
                    checked={regionFilter.includes(region)}
                  />
                  {filterOptions.regions[region]}
                </label>
              ))}
            </div>
          </div>
          <div
            className={[classes.filterGroup, openFilters.includes('budgets') ? classes.open : '']
              .filter(Boolean)
              .join(' ')}
          >
            <button
              className={classes.filterGroupHeader}
              onClick={() => toggleOpenGroup('budgets')}
            >
              Budgets{' '}
              {budgetFilter.length > 0 && <div className={classes.pill}>{budgetFilter.length}</div>}
              <ChevronDownIcon size="small" className={classes.chevron} />
            </button>
            <div className={classes.checkboxes}>
              {budgetFiltersList.map(budget => (
                <label key={budget}>
                  <input
                    type="checkbox"
                    name={budget}
                    onChange={e => handleFilterChange('budgets', budget, e.target.checked)}
                    checked={budgetFilter.includes(budget)}
                  />
                  {filterOptions.budgets[budget]}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="cols-12">
        <PartnerGrid partners={filteredPartners} />
      </div>
      <BackgroundGrid />
    </Gutter>
  )
}
