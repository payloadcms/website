import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { draftMode } from 'next/headers.js'

import type {
  Budget,
  CaseStudy,
  CommunityHelp,
  Footer,
  Industry,
  MainMenu,
  Page,
  Partner,
  PartnerProgram,
  Post,
  Region,
  Specialty,
} from '../../payload-types.js'

export const fetchGlobals = async (): Promise<{ mainMenu: MainMenu; footer: Footer }> => {
  const payload = await getPayloadHMR({ config })
  const mainMenu = await payload.findGlobal({
    slug: 'main-menu',
  })
  const footer = await payload.findGlobal({
    slug: 'footer',
  })

  return {
    mainMenu,
    footer,
  }
}

export const fetchPage = async (incomingSlugSegments?: string[]): Promise<Page | null> => {
  const { isEnabled: draft } = draftMode()

  const payload = await getPayloadHMR({ config })
  const slugSegments = incomingSlugSegments || ['home']
  const slug = slugSegments.at(-1)

  const data = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    draft,
  })

  const pagePath = `/${slugSegments.join('/')}`

  const page = data.docs.find(({ breadcrumbs }: Page) => {
    if (!breadcrumbs) return false
    const { url } = breadcrumbs[breadcrumbs.length - 1]
    return url === pagePath
  })

  if (page) {
    return page
  }

  return null
}

export const fetchPages = async (): Promise<
  Array<{ breadcrumbs: Page['breadcrumbs']; slug: Page['slug'] }>
> => {
  const payload = await getPayloadHMR({ config })
  const data = await payload.find({
    collection: 'pages',
    limit: 300,
    where: { slug: { not_equals: 'cloud' } },
  })

  const pages = data.docs.map(doc => {
    return {
      breadcrumbs: doc.breadcrumbs,
      slug: doc.slug,
    }
  })

  return pages
}

export const fetchPosts = async (): Promise<Array<{ slug: Post['slug'] }>> => {
  const payload = await getPayloadHMR({ config })
  const data = await payload.find({
    collection: 'posts',
    limit: 300,
  })

  const posts = data.docs.map(doc => {
    return {
      slug: doc.slug,
    }
  })

  return posts
}

export const fetchBlogPosts = async (): Promise<Post[]> => {
  const currentDate = new Date()
  const payload = await getPayloadHMR({ config })

  const data = await payload.find({
    collection: 'posts',
    limit: 300,
    where: { publishedOn: { less_than_equal: currentDate } },
    sort: '-publishedOn',
  })
  return data.docs
}

export const fetchBlogPost = async (slug: string): Promise<Post> => {
  const { isEnabled: draft } = draftMode()
  const payload = await getPayloadHMR({ config })

  const data = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    draft,
    limit: 1,
  })

  return data.docs[0]
}

export const fetchCaseStudies = async (): Promise<CaseStudy[]> => {
  const payload = await getPayloadHMR({ config })
  const data = await payload.find({
    collection: 'case-studies',
    limit: 300,
  })

  return data.docs
}

export const fetchCaseStudy = async (slug: string): Promise<CaseStudy> => {
  const { isEnabled: draft } = draftMode()
  const payload = await getPayloadHMR({ config })

  const data = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    draft,
    limit: 1,
  })

  return data.docs[0]
}

export const fetchCommunityHelps = async (
  communityHelpType: CommunityHelp['communityHelpType'],
): Promise<CommunityHelp[]> => {
  const payload = await getPayloadHMR({ config })

  const data = await payload.find({
    collection: 'community-help',
    limit: 0,
    where: {
      and: [{ communityHelpType: { equals: communityHelpType } }, { helpful: { equals: true } }],
    },
  })

  return data.docs
}

export const fetchCommunityHelp = async (slug: string): Promise<CommunityHelp> => {
  const payload = await getPayloadHMR({ config })

  const data = await payload.find({
    collection: 'community-help',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  return data.docs[0]
}

export const fetchRelatedThreads = async (): Promise<CommunityHelp[]> => {
  const payload = await getPayloadHMR({ config })

  const data = await payload.find({
    collection: 'community-help',
    where: { relatedDocs: { not_equals: null } },
    limit: 0,
  })

  return data.docs
}

export const fetchPartners = async (): Promise<Partner[]> => {
  const payload = await getPayloadHMR({ config })

  const data = await payload.find({
    collection: 'partners',
    limit: 300,
    where: { AND: [{ agency_status: { equals: 'active' } }, { _status: { equals: 'published' } }] },
    sort: 'slug',
  })

  return data.docs
}

export const fetchPartner = async (slug: string): Promise<Partner> => {
  const { isEnabled: draft } = draftMode()
  const payload = await getPayloadHMR({ config })

  const data = await payload.find({
    collection: 'partners',
    where: { slug: { equals: slug } },
    draft,
    limit: 1,
  })

  return data.docs[0]
}

export const fetchPartnerProgram = async (): Promise<PartnerProgram> => {
  const payload = await getPayloadHMR({ config })
  const data = await payload.findGlobal({
    slug: 'partner-program',
  })

  return data
}

export const fetchFilters = async (): Promise<{
  industries: Industry[]
  specialties: Specialty[]
  regions: Region[]
  budgets: Budget[]
}> => {
  const payload = await getPayloadHMR({ config })

  const industries = await payload.find({
    collection: 'industries',
    limit: 100,
  })

  const specialties = await payload.find({
    collection: 'specialties',
    limit: 100,
  })

  const regions = await payload.find({
    collection: 'regions',
    limit: 100,
  })

  const budgets = await payload.find({
    collection: 'budgets',
    limit: 100,
  })

  return {
    industries: industries.docs,
    specialties: specialties.docs,
    regions: regions.docs,
    budgets: budgets.docs,
  }
}
