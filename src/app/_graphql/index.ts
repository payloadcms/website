import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import type {
  Announcement,
  CaseStudy,
  CommunityHelp,
  Footer,
  MainMenu,
  Page,
  Post,
  TopBar,
} from '../../payload-types'
import { ANNOUNCEMENT_FIELDS } from './announcement'
import { CASE_STUDIES, CASE_STUDY } from './case-studies'
import { COMMUNITY_HELP, COMMUNITY_HELPS, RELATED_THREADS } from './community-helps'
import { GLOBALS } from './globals'
import { PAGE, PAGES } from './pages'
import { POST, POST_SLUGS, POSTS } from './posts'
import { payloadToken } from './token'

export const fetchGlobals = async (): Promise<{
  mainMenu: MainMenu
  footer: Footer
  topBar: TopBar
}> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?globals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GLOBALS,
    }),
  }).then(res => res.json())

  return {
    mainMenu: data.MainMenu,
    footer: data.Footer,
    topBar: data.TopBar,
  }
}

export const fetchAnnouncements = async (): Promise<{
  announcements: Announcement[]
}> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?announcements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: ANNOUNCEMENT_FIELDS,
    }),
  }).then(res => res.json())

  return {
    announcements: data?.Announcements?.docs || [],
  }
}

export const fetchPage = async (
  incomingSlugSegments?: string[],
  draft?: boolean,
): Promise<Page | null> => {
  const slugSegments = incomingSlugSegments || ['home']
  const slug = slugSegments.at(-1)

  let token: RequestCookie | undefined

  if (draft) {
    const { cookies } = await import('next/headers')
    token = cookies().get(payloadToken)
  }

  const { data, errors } = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?page=${slug}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
      },
      next: {
        tags: [`pages_${slug}`],
      },
      body: JSON.stringify({
        query: PAGE,
        variables: {
          slug,
          draft,
        },
      }),
    },
  ).then(res => res.json())

  if (errors) {
    console.error(JSON.stringify(errors)) // eslint-disable-line no-console
    throw new Error()
  }

  const pagePath = `/${slugSegments.join('/')}`

  const page = data.Pages?.docs.find(({ breadcrumbs }: Page) => {
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
  Array<{ breadcrumbs: Page['breadcrumbs']; slug: string }>
> => {
  const { data, errors } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: PAGES,
    }),
  }).then(res => res.json())

  if (errors) {
    console.error(JSON.stringify(errors)) // eslint-disable-line no-console
    throw new Error()
  }

  return data.Pages.docs
}

export const fetchPosts = async (): Promise<Array<{ slug: string }>> => {
  const { data, errors } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: POST_SLUGS,
    }),
  }).then(res => res.json())

  if (errors) {
    console.error(JSON.stringify(errors)) // eslint-disable-line no-console
    throw new Error()
  }

  return data?.Posts?.docs
}

export const fetchBlogPosts = async (): Promise<Post[]> => {
  const currentDate = new Date()
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?blogPosts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: POSTS,
      variables: {
        publishedOn: currentDate,
      },
    }),
  }).then(res => res.json())

  return data?.Posts?.docs
}

export const fetchBlogPost = async (slug: string, draft?: boolean): Promise<Post> => {
  let token: RequestCookie | undefined

  if (draft) {
    const { cookies } = await import('next/headers')
    token = cookies().get(payloadToken)
  }

  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?post=${slug}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
    },
    next: {
      tags: [`posts_${slug}`],
    },
    body: JSON.stringify({
      query: POST,
      variables: {
        slug,
        draft,
      },
    }),
  }).then(res => res.json())

  return data?.Posts?.docs[0]
}

export const fetchCaseStudies = async (): Promise<CaseStudy[]> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?case-studies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: CASE_STUDIES,
    }),
  }).then(res => res.json())

  return data?.CaseStudies?.docs
}

export const fetchCaseStudy = async (slug: string): Promise<CaseStudy> => {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?case-study=${slug}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CASE_STUDY,
        variables: {
          slug,
        },
      }),
      next: {
        tags: [`case-studies_${slug}`],
      },
    },
  ).then(res => res.json())

  return data?.CaseStudies?.docs[0]
}

export const fetchCommunityHelps = async (
  communityHelpType: CommunityHelp['communityHelpType'],
): Promise<CommunityHelp[]> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?communityHelps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: COMMUNITY_HELPS,
      variables: {
        communityHelpType,
      },
    }),
  }).then(res => res.json())

  return data?.CommunityHelps?.docs
}

export const fetchCommunityHelp = async (slug: string): Promise<CommunityHelp> => {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?communityHelp=${slug}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: COMMUNITY_HELP,
        variables: {
          slug,
        },
      }),
    },
  ).then(res => res.json())

  return data?.CommunityHelps?.docs[0]
}

export const fetchRelatedThreads = async (): Promise<CommunityHelp[]> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql?communityHelps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: RELATED_THREADS,
    }),
  }).then(res => res.json())

  return data?.CommunityHelps?.docs
}
