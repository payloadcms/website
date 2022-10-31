import React from 'react'
import { getDoc } from './api'
import classes from './index.module.scss'

const Doc = async ({ params }) => {
  const { topic, doc } = params

  const {
    data: { title },
  } = await getDoc({ topic, doc })

  return (
    <div>
      <h1 className={classes.title}>{title}</h1>
    </div>
  )
}

export default Doc
