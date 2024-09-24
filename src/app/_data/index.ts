import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache.js'
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
  Redirect,
  Region,
  Specialty,
} from '../../payload-types.js'

export const fetchGlobals = unstable_cache(
  async (): Promise<{ footer: Footer; mainMenu: MainMenu }> => {
    const payload = await getPayloadHMR({ config })
    const mainMenu = await payload.findGlobal({
      slug: 'main-menu',
    })
    const footer = await payload.findGlobal({
      slug: 'footer',
    })

    return {
      footer,
      mainMenu,
    }
  },
  [],
  {
    revalidate: false,
    tags: ['globals', 'footer', 'main-menu'],
  },
)

export const fetchPage = (incomingSlugSegments?: string[]) =>
  unstable_cache(
    async (): Promise<Page | null> => {
      const { isEnabled: draft } = draftMode()

      const payload = await getPayloadHMR({ config })
      const slugSegments = incomingSlugSegments || ['home']
      const slug = slugSegments.at(-1)

      const data = await payload.find({
        collection: 'pages',
        draft,
        limit: 1,
        where: {
          slug: {
            equals: slug,
          },
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
    },
    [`page-${incomingSlugSegments?.join('-')}`],
    {
      revalidate: false,
      tags: [`page-${incomingSlugSegments?.join('-')}`, 'pages'],
    },
  )

export const fetchPages = unstable_cache(
  async (): Promise<Array<{ breadcrumbs: Page['breadcrumbs']; slug: Page['slug'] }>> => {
    const payload = await getPayloadHMR({ config })
    const data = await payload.find({
      collection: 'pages',
      limit: 300,
      where: { slug: { not_equals: 'cloud' } },
    })

    const pages = data.docs.map(doc => {
      return {
        slug: doc.slug,
        breadcrumbs: doc.breadcrumbs,
      }
    })

    return pages
  },
  [],
  {
    revalidate: false,
    tags: ['pages'],
  },
)

export const fetchPosts = unstable_cache(
  async (): Promise<Array<{ slug: Post['slug'] }>> => {
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
  },
  [],
  {
    revalidate: false,
    tags: ['blog'],
  },
)

export const fetchBlogPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const currentDate = new Date()
    const payload = await getPayloadHMR({ config })

    const data = await payload.find({
      collection: 'posts',
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
  },
  [],
  {
    revalidate: false,
    tags: ['blog'],
  },
)

export const fetchBlogPost = (slug: string) =>
  unstable_cache(
    async (): Promise<Post> => {
      const { isEnabled: draft } = draftMode()
      const payload = await getPayloadHMR({ config })

      const data = await payload.find({
        collection: 'posts',
        draft,
        limit: 1,
        where: { slug: { equals: slug } },
      })

      return data.docs[0]
    },
    [`post-${slug}`],
    {
      revalidate: false,
      tags: [`post-${slug}`, 'blog'],
    },
  )

export const fetchCaseStudies = unstable_cache(
  async (): Promise<CaseStudy[]> => {
    const payload = await getPayloadHMR({ config })
    const data = await payload.find({
      collection: 'case-studies',
      limit: 300,
    })

    return data.docs
  },
  [],
  {
    revalidate: false,
    tags: ['case-studies'],
  },
)

export const fetchCaseStudy = (slug: string) =>
  unstable_cache(
    async (): Promise<CaseStudy> => {
      const { isEnabled: draft } = draftMode()
      const payload = await getPayloadHMR({ config })

      const data = await payload.find({
        collection: 'case-studies',
        draft,
        limit: 1,
        where: { slug: { equals: slug } },
      })

      return data.docs[0]
    },
    [`case-study-${slug}`],
    {
      revalidate: false,
      tags: [`case-study-${slug}`, 'case-studies'],
    },
  )

export const fetchCommunityHelps = unstable_cache(
  async (communityHelpType: CommunityHelp['communityHelpType']): Promise<CommunityHelp[]> => {
    const payload = await getPayloadHMR({ config })

    const data = await payload.find({
      collection: 'community-help',
      limit: 0,
      where: {
        and: [{ communityHelpType: { equals: communityHelpType } }, { helpful: { equals: true } }],
      },
    })

    return data.docs
  },
  [],
  {
    revalidate: false,
    tags: ['community-help'],
  },
)

export const fetchCommunityHelp = (slug: string) =>
  unstable_cache(
    async (): Promise<CommunityHelp> => {
      const payload = await getPayloadHMR({ config })

      const data = await payload.find({
        collection: 'community-help',
        limit: 1,
        where: { slug: { equals: slug } },
      })

      return data.docs[0]
    },
    [`community-help-${slug}`],
    {
      revalidate: false,
      tags: [`community-help-${slug}`, 'community-help'],
    },
  )

export const fetchRelatedThreads = unstable_cache(
  async (): Promise<CommunityHelp[]> => {
    const payload = await getPayloadHMR({ config })

    const data = await payload.find({
      collection: 'community-help',
      limit: 0,
      where: { relatedDocs: { not_equals: null } },
    })

    return data.docs
  },
  [],
  {
    revalidate: false,
    tags: ['community-help', 'related-threads'],
  },
)

export const fetchPartners = unstable_cache(
  async (): Promise<Partner[]> => {
    const payload = await getPayloadHMR({ config })

    const data = await payload.find({
      collection: 'partners',
      limit: 300,
      sort: 'slug',
      where: {
        AND: [{ agency_status: { equals: 'active' } }, { _status: { equals: 'published' } }],
      },
    })

    return data.docs
  },
  [],
  {
    revalidate: false,
    tags: ['partner-program'],
  },
)

export const fetchPartner = (slug: string) =>
  unstable_cache(
    async (): Promise<Partner> => {
      const { isEnabled: draft } = draftMode()
      const payload = await getPayloadHMR({ config })

      const data = await payload.find({
        collection: 'partners',
        draft,
        limit: 1,
        where: { slug: { equals: slug } },
      })

      return data.docs[0]
    },
    [`partner-${slug}`],
    {
      revalidate: false,
      tags: [`partner-${slug}`, 'partner-program'],
    },
  )()

export const fetchPartnerProgram = unstable_cache(
  async (): Promise<PartnerProgram> => {
    const payload = await getPayloadHMR({ config })
    const data = await payload.findGlobal({
      slug: 'partner-program',
    })

    return data
  },
  [],
  {
    revalidate: false,
    tags: ['partner-program'],
  },
)

export const fetchFilters = unstable_cache(
  async (): Promise<{
    budgets: Budget[]
    industries: Industry[]
    regions: Region[]
    specialties: Specialty[]
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
      budgets: budgets.docs,
      industries: industries.docs,
      regions: regions.docs,
      specialties: specialties.docs,
    }
  },
  [],
  {
    revalidate: false,
    tags: ['partner-filters'],
  },
)

export const fetchRedirect = (url: string) =>
  unstable_cache(
    async (): Promise<Redirect> => {
      const payload = await getPayloadHMR({ config })
      const redirect = await payload.find({
        collection: 'redirects',
        limit: 1,
        where: {
          from: {
            equals: url,
          },
        },
      })

      return redirect.docs[0]
    },
    [`redirect-${url}`],
    {
      revalidate: false,
      tags: ['redirects'],
    },
  )
