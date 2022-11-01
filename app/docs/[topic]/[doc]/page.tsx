import React from 'react'
import { getDoc } from './api'
import { DocTemplate } from './DocTemplate'

const Doc = async ({ params }) => {
  const { topic, doc: docSlug } = params
  const doc = await getDoc({ topic, doc: docSlug })
  return <DocTemplate doc={doc} />
}

export default Doc
