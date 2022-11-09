import type { CaseStudy, Footer, MainMenu, Page, Post, UseCase } from '../payload-types'
import { CASE_STUDIES, CASE_STUDY } from './case-studies'
import { GLOBALS } from './globals'
import { PAGE } from './pages'
import { POST, POSTS } from './posts'
import { USE_CASE } from './use-cases'

export const fetchGlobals = async (): Promise<{ mainMenu: MainMenu; footer: Footer }> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
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
  }
}

export const fetchPage = async (slug: string): Promise<Page> => {
  const { data, errors } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: PAGE,
      variables: {
        slug,
      },
    }),
  }).then(res => res.json())

  if (errors) {
    console.error(JSON.stringify(errors))
    throw new Error()
  }

  return data.Pages.docs[0]
}

export const fetchBlogPosts = async (): Promise<Post[]> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: POSTS,
    }),
  }).then(res => res.json())

  return data.Posts.docs
}

export const fetchBlogPost = async (slug: string): Promise<Post> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: POST,
      variables: {
        slug,
      },
    }),
  }).then(res => res.json())

  return data.Posts.docs[0]
}

export const fetchCaseStudies = async (): Promise<CaseStudy[]> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: CASE_STUDIES,
      variables: {
        slug: 'case-studies',
      },
    }),
  }).then(res => res.json())

  return data.CaseStudies.docs
}

export const fetchCaseStudy = async (slug: string): Promise<CaseStudy> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
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
  }).then(res => res.json())

  return data.CaseStudies.docs[0]
}

export const fetchUseCase = async (slug: string): Promise<UseCase> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: USE_CASE,
      variables: {
        slug,
      },
    }),
  }).then(res => res.json())

  return data.UseCases.docs[0]
}
