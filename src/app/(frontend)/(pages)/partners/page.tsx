import type { Metadata } from 'next/types'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { PartnerDirectory } from '@components/PartnerDirectory'
import { PartnerGrid } from '@components/PartnerGrid'
import { RenderBlocks } from '@components/RenderBlocks'
import { fetchFilters, fetchPartnerProgram, fetchPartners } from '@data'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import classes from './index.module.scss'

export const metadata: Metadata = {
  description:
    'Connect with a Payload expert to help you build, launch, and scale your digital products.',
  title: 'Find a Payload Partner',
}

export default async function Partners() {
  const { isEnabled: draft } = await draftMode()

  const getPartnerProgram = draft
    ? fetchPartnerProgram
    : unstable_cache(fetchPartnerProgram, ['partnerProgram'])
  const partnerProgram = await getPartnerProgram()

  if (!partnerProgram) {
    return notFound()
  }
  const { contentBlocks, featuredPartners } = partnerProgram

  const getPartners = draft ? fetchPartners : unstable_cache(fetchPartners, ['partners'])
  const partners = await getPartners()
  const partnerList = partners.map((partner) => {
    return {
      ...partner,
      budgets: partner.budgets
        .map((budget) => typeof budget !== 'string' && budget.value)
        .filter((value): value is string => !!value),
      industries: partner.industries
        .map((industry) => typeof industry !== 'string' && industry.value)
        .filter((value): value is string => !!value),
      regions: partner.regions
        .map((region) => typeof region !== 'string' && region.value)
        .filter((value): value is string => !!value),
      specialties: partner.specialties
        .map((specialty) => typeof specialty !== 'string' && specialty.value)
        .filter((value): value is string => !!value),
    }
  })

  const getFilters = draft ? fetchFilters : unstable_cache(fetchFilters, ['filters'])
  const filters = await getFilters()

  const filterOptions = {
    budgets: filters.budgets.filter((budget) => {
      return partnerList.some((partner) => partner.budgets.includes(budget.value))
    }),
    industries: filters.industries.filter((industry) => {
      return partnerList.some((partner) => partner.industries.includes(industry.value))
    }),
    regions: filters.regions.filter((region) => {
      return partnerList.some((partner) => partner.regions.includes(region.value))
    }),
    specialties: filters.specialties.filter((specialty) => {
      return partnerList.some((partner) => partner.specialties.includes(specialty.value))
    }),
  }

  return (
    <BlockWrapper settings={{}}>
      <BreadcrumbsBar
        breadcrumbs={[
          {
            label: 'Agency Partners',
          },
        ]}
        links={[
          {
            label: 'Become a Partner',
            url: '/partners',
          },
        ]}
      />
      <Gutter className={[classes.hero, 'grid'].join(' ')}>
        {featuredPartners && (
          <div className={[classes.featuredPartnersWrapper, 'cols-16'].join(' ')}>
            <div className={[classes.featuredPartnersHeader, 'cols-16 grid'].join(' ')}>
              <h2 className="cols-12 cols-m-8">Featured Partners</h2>
              <p className="cols-4 start-13 cols-m-8 start-m-1">{featuredPartners.description}</p>
            </div>
            <PartnerGrid featured partners={featuredPartners.partners} />
          </div>
        )}
        <BackgroundGrid />
      </Gutter>
      {contentBlocks?.beforeDirectory && <RenderBlocks blocks={contentBlocks?.beforeDirectory} />}
      <PartnerDirectory filterOptions={filterOptions} partnerList={partnerList} />
      {contentBlocks?.afterDirectory && <RenderBlocks blocks={contentBlocks?.afterDirectory} />}
    </BlockWrapper>
  )
}
