const { spawn } = require('child_process');

export default function handler(req, res) {
  const sendToAlgoliaScript = spawn('node', ['scripts/send-algolia-data.mjs']);

  sendToAlgoliaScript.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  sendToAlgoliaScript.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  sendToAlgoliaScript.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  res.status(200).end('Hello Community Help Algolia Cron!');
}