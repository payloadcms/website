import React from 'react'

import Code from '@components/Code'

import classes from './index.module.scss'

export const GenerateRequest = ({ req, row }) => {
  if (!req) return null
  const reqBody = req.body
    ? Object.entries(req.body).map(([key, value]) => {
        return `
          ${key}: "${value}"`
      })
    : ''

  const query = `import qs from "qs";

const stringifiedQuery = qs.stringify({
  where: {
    title: {
      contains: "New",
    },
  },
},{ addQueryPrefix: true });
`

  const body = `{
        method: "${row.method}",
        headers: {
          "Content-Type": "application/json",
        },${
          req.body
            ? `
        body: JSON.stringify({${reqBody}
        }),`
            : ``
        }
      }`

  const request = `const req = await fetch('{cms-url}${row.path}${
    req.query ? `/{stringifiedQuery}'` : `'`
  }${req.headers || req.body ? `, ${body})` : ')'}`

  const fullRequest = `${
    req.query
      ? `${query}
`
      : ``
  }const ${row.example.slug} = async () => {
    try {
      ${request}
      const data = await req.json()
      return data
    } catch (err) {
      console.log(err)
    }
}`

  return (
    <>
      <h5>Request</h5>
      <Code className={classes.code}>{fullRequest}</Code>
    </>
  )
}
