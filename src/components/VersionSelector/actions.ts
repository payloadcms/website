'use server'

import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'

export async function setVersionCookie(version: string): Promise<void> {
  cookies().set('payload-docs-version', version)
  // if (version !== 'current') {
  //   redirect(`/docs/${version}`)
  // }
  // redirect('/docs')
}
