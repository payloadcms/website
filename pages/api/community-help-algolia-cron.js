const { spawn } = require('child_process')

export default function handler(req, res) {
  const sendToAlgoliaScript = spawn('node', ['scripts/send-algolia-data.mjs'])

  sendToAlgoliaScript.stdout.on('data', data => {
    // eslint-disable-next-line no-console
    console.log(`stdout: ${data}`)
  })

  sendToAlgoliaScript.stderr.on('data', data => {
    // eslint-disable-next-line no-console
    console.error(`stderr: ${data}`)
  })

  sendToAlgoliaScript.on('close', code => {
    // eslint-disable-next-line no-console
    console.log(`child process exited with code ${code}`)
  })

  res.status(200).end('Hello Community Help Algolia Cron!')
}
