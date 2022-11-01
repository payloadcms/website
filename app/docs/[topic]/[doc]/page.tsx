import React from 'react'
import { getDoc } from './api'
import { DocTemplate } from './DocTemplate'

const Doc = async ({ params }) => {
  const { topic, doc } = params

  const {
    content,
    data: { title },
  } = await getDoc({ topic, doc })

  return <DocTemplate title={title} content={content} />
}

export default Doc
