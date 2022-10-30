import type { MainMenu, Page } from '../payload-types'
import { MAIN_MENU } from './globals'
import { PAGE } from './pages'

export const fetchGlobals = async (): Promise<{ mainMenu: MainMenu }> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: MAIN_MENU,
    }),
  }).then(res => res.json())

  return {
    mainMenu: data.MainMenu,
  }
}

export const fetchPage = async (slug: string): Promise<Page> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
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

  return data.Pages.docs[0]
}
