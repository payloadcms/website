import * as React from 'react'

const Page = async () => {
  // fetch env vars from project
  const test = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/63e5688f6b11118ab57942b3/env`,
  )
  const val = await test.json()
  console.log({ val })

  return <div>File storage</div>
}

export default Page
