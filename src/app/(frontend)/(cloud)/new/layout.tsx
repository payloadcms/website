import { fetchMe } from '@cloud/_api/fetchMe'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import Link from 'next/link'
import { Fragment } from 'react'

export default async function NewProjectLayout({ children }: { children: React.ReactNode }) {
  const { user } = await fetchMe()

  const isEnterprise = user?.teams?.some(
    ({ team }) => typeof team !== 'string' && team?.isEnterprise,
  )

  if (!isEnterprise) {
    return (
      <Fragment>
        <Gutter>
          <Heading as="h3" element="h1">
            Not Allowed
          </Heading>
          <p>Project creation is only available for Enterprise teams.</p>
          <Link href="/cloud">Return Home</Link>
        </Gutter>
      </Fragment>
    )
  }

  return <>{children}</>
}
