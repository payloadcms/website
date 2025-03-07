import Code from '@components/Code/index'
import React from 'react'

import classes from './index.module.scss'

export const GenerateRequest = ({ req, row }) => {
  if (!req) {
    return null
  }

  const reqBody = req.body
    ? Object.entries(req.body).map(([key, value]) => {
        let body = `
      ${key}: "${value}"`

        if (typeof value === 'object' && value) {
          const nestedValue = Object.entries(value).map(([key, value]) => {
            return `
        ${key}: "${value}"`
          })
          body = `
      ${key}: {${nestedValue}
      },`
        }

        return body
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
    method: "${row.method}", ${
      req.credentials
        ? `
    credentials: "include",`
        : ``
    }
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
  }try {
  ${request}
  const data = await req.json()
} catch (err) {
  console.log(err)
}`

  return (
    <>
      <h5>Request</h5>
      <Code className={classes.code} disableMinHeight>
        {fullRequest}
      </Code>
    </>
  )
}
