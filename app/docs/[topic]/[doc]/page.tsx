import React from 'react'
import { getDoc } from './api'
import classes from './index.module.scss'
import { DocTemplate } from './DocTemplate'

const Doc = async ({ params }) => {
  const { topic, doc } = params

  const {
    content,
    data: { title },
  } = await getDoc({ topic, doc })

  return (
    <div>
      <h1 className={classes.title}>{title}</h1>
      <DocTemplate content={content} />
    </div>
  )
}

export default Doc
