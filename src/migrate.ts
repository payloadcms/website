import config from '@payload-config'
import { migrateSlateToLexical } from '@payloadcms/richtext-lexical/migrate'
import { getPayload } from 'payload'

async function run() {
  const payload = await getPayload({ config })

  await migrateSlateToLexical({ payload })
  process.exit(0)
}

void run()
