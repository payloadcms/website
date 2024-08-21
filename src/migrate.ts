import config from '@payload-config'
import { migrateSlateToLexical } from '@payloadcms/richtext-lexical/migrate'
import { getPayload } from 'payload'

async function run() {
  const payload = await getPayload({ config })

  console.log('Converting everything now...')
  await migrateSlateToLexical({ payload })
  console.log('Done!')
  process.exit(0)
}

void run()
