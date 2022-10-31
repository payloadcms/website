import React from 'react'
import { App } from '../../../App'
import { getDoc } from './data'
import { RenderDoc } from './Render'

const Doc = ({ params }) => {
  const { topic, doc } = params

  const docData = getDoc({ topic, doc })

  return (
    <App>
      <RenderDoc {...docData} />
    </App>
  )
}

export default Doc
