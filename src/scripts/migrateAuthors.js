const payload = require('payload')
const path = require('path')

// eslint-disable-next-line
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
})

const { MONGODB_URI, PAYLOAD_SECRET } = process.env

process.env.PAYLOAD_CONFIG_PATH = 'dist/payload.config.js'

const migrateStatus = async () => {
  // Initialize Payload
  // IMPORTANT: make sure your ENV variables are filled properly here
  // as the below variable names are just for reference.
  await payload.init({
    secret: PAYLOAD_SECRET,
    mongoURL: MONGODB_URI,
    local: true,
  })

  const docs = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 700,
  })

  await Promise.all(
    docs.docs.map(async doc => {
      const newAuthors = [
        ...(doc?.authors?.map(author => {
          return author && typeof author === 'object' ? author.id : author
        }) || []),
        doc.author && typeof doc.author === 'object' ? doc.author.id : doc.author,
      ].filter(Boolean)

      if (newAuthors.length === 0) {
        return
      }

      try {
        await payload.update({
          collection: 'posts',
          id: doc.id,
          data: {
            ...doc,
            authors: newAuthors,
            author: null,
          },
        })

        payload.logger.info(`Success! Post with slug: '${doc.slug}' successfully migrated authors.`)
      } catch (err) {
        payload.logger.error(`Failed. Post with slug: '${doc.slug}' failed to migrate authors.`)
      }
    }),
  )

  payload.logger.info('Complete')
  process.exit(0)
}

migrateStatus()
