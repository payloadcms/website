import config from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers.js'

import type {
  Budget,
  CaseStudy,
  CommunityHelp,
  Footer,
  Form,
  GetStarted,
  Industry,
  MainMenu,
  Page,
  Partner,
  PartnerProgram,
  Post,
  Region,
  Specialty,
} from '../../payload-types.js'

export const fetchGlobals = async (): Promise<{ footer: Footer; mainMenu: MainMenu }> => {
  const payload = await getPayload({ config })
  const mainMenu = await payload.findGlobal({
    slug: 'main-menu',
    depth: 1,
  })
  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 1,
  })

  return {
    footer,
    mainMenu,
  }
}

export const fetchPage = async (incomingSlugSegments: string[]): Promise<Page | null> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const slugSegments = incomingSlugSegments || ['home']
  const slug = slugSegments.at(-1)

  const data = await payload.find({
    collection: 'pages',
    depth: 2,
    draft,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
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
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 300,
    where: {
      and: [
        {
          slug: {
            not_equals: 'cloud',
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  const pages = data.docs.map(doc => {
    return {
      slug: doc.slug,
      breadcrumbs: doc.breadcrumbs,
    }
  })

  return pages
}

export const fetchPosts = async (): Promise<Array<{ slug: Post['slug'] }>> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'posts',
    depth: 0,
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
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 300,
    sort: '-publishedOn',
    where: {
      and: [
        { publishedOn: { less_than_equal: currentDate } },
        { _status: { equals: 'published' } },
      ],
    },
  })
  return data.docs
}

export const fetchBlogPost = async (slug: string): Promise<Post> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'posts',
    depth: 2,
    draft,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return data.docs[0]
}

export const fetchCaseStudies = async (): Promise<CaseStudy[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 300,
  })

  return data.docs
}

export const fetchCaseStudy = async (slug: string): Promise<CaseStudy> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return data.docs[0]
}

export const fetchCommunityHelps = async (
  communityHelpType: CommunityHelp['communityHelpType'],
): Promise<Pick<CommunityHelp, 'slug'>[]> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'community-help',
    depth: 0,
    limit: 0,
    select: { slug: true },
    where: {
      and: [{ communityHelpType: { equals: communityHelpType } }, { helpful: { equals: true } }],
    },
  })

  return data.docs
}

export const fetchCommunityHelp = async (slug: string): Promise<CommunityHelp> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'community-help',
    limit: 1,
    where: { slug: { equals: slug } },
  })

  return data.docs[0]
}

export const fetchRelatedThreads = async (path: string): Promise<CommunityHelp[]> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'community-help',
    depth: 0,
    limit: 0,
    where: { 'relatedDocs.path': { equals: path } },
  })

  return data.docs
}

export const fetchPartners = async (): Promise<Partner[]> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'partners',
    depth: 2,
    limit: 300,
    sort: 'slug',
    where: {
      AND: [{ agency_status: { equals: 'active' } }, { _status: { equals: 'published' } }],
    },
  })

  return data.docs
}

export const fetchPartner = async (slug: string): Promise<Partner> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'partners',
    depth: 1,
    draft,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return data.docs[0]
}

export const fetchPartnerProgram = async (): Promise<PartnerProgram> => {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({
    slug: 'partner-program',
    depth: 2,
  })

  return data
}

export const fetchFilters = async (): Promise<{
  budgets: Budget[]
  industries: Industry[]
  regions: Region[]
  specialties: Specialty[]
}> => {
  const payload = await getPayload({ config })

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
    budgets: budgets.docs,
    industries: industries.docs,
    regions: regions.docs,
    specialties: specialties.docs,
  }
}

export const fetchGetStarted = async (): Promise<GetStarted> => {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({
    slug: 'get-started',
    depth: 1,
  })

  return data
}

export const fetchForm = async (name: string): Promise<Form> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'forms',
    depth: 1,
    limit: 1,
    where: {
      title: {
        equals: name,
      },
    },
  })

  return data.docs[0]
}
