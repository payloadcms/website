'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Label } from '@components/Label'

export const LandingNoUser = () => {
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    if (pathname !== '/new' && router) router.replace('/new')
  }, [pathname, router])

  return (
    <Gutter>
      <Label>New</Label>
      <h1>Let's build something awesome.</h1>
      <p>
        {`You need to `}
        <Link href="/login?redirect=%2Fnew">log in</Link>
        {` to create a new project. If you don't have an account, you can `}
        <Link href="/create-account">create one</Link>
        {` for free.`}
      </p>

      <div>
        <Heading as="h4">Custom sign up page displaying templates and sign up form?</Heading>
      </div>
    </Gutter>
  )
}
