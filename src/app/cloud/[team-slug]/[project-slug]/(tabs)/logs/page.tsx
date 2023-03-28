import * as React from 'react'

import { Heading } from '@components/Heading'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'

import classes from './index.module.scss'

const exampleLog = [
  '0|prod | Error while sending email to address:',
  '0|prod | ResponseError: Forbidden',
  '0|prod | at Request._callback (node_modules/@sendgrid/client/src/classes/client.js:124:25)',
  '0|prod | at Request.self.callback (node_modules/request/request.js:185:22)',
  '0|prod | at Request.emit (node:events:520:28)',
  '0|prod | at Request.<anonymous> (node_modules/request/request.js:1154:10)',
  '0|prod | at Request.emit (node:events:520:28)',
  '0|prod | at IncomingMessage.<anonymous> (node_modules/request/request.js:1076:12)',
  '0|prod | at Object.onceWrapper (node:events:639:28)',
  '0|prod | at IncomingMessage.emit (node:events:532:35)',
  '0|prod | at endReadableNT (node:internal/streams/readable:1343:12)',
  '0|prod | at processTicksAndRejections (node:internal/process/task_queues:83:21) {',
  '0|prod | code: 403,',
  '0|prod | response: {',
  '0|prod | headers: {',
  "0|prod | server: 'nginx',",
  "0|prod | date: 'Tue, 15 Nov 2022 15:43:51 GMT',",
  "0|prod | 'content-type': 'application/json',",
  "0|prod | 'content-length': '281',",
  "0|prod | connection: 'close',",
  "0|prod | 'access-control-allow-origin': 'https://sendgrid.api-docs.io',",
  "0|prod | 'access-control-allow-methods': 'POST',",
  "0|prod | 'access-control-allow-headers': 'Authorization, Content-Type, On-behalf-of, x-sg-elas-acl',",
  "0|prod | 'access-control-max-age': '600',",
  "0|prod | 'x-no-cors-reason': 'https://sendgrid.com/docs/Classroom/Basics/API/cors.html',",
  "0|prod | 'strict-transport-security': 'max-age=600; includeSubDomains'",
  '0|prod | },',
  '0|prod | body: { errors: [Array] }',
  '0|prod | }',
  '0|prod | }',
]

export default async () => {
  return (
    <div>
      <Heading element="h5" marginTop={false}>
        Deployment build logs
      </Heading>

      <ExtendedBackground
        pixels
        upperChildren={
          <div className={classes.console}>
            {exampleLog.map((line, i) => (
              <code key={i}>{line}</code>
            ))}
          </div>
        }
      />
    </div>
  )
}
