// @ts-nocheck

import payload from 'payload'

// eslint-disable-next-line
require('dotenv').config()

const { MONGODB_URI, PAYLOAD_SECRET } = process.env

// This function ensures that there is at least one corresponding version for any document
// within each of your draft-enabled collections.

const ensureAtLeastOneVersion = async (): Promise<void> => {
  // Initialize Payload
  // IMPORTANT: make sure your ENV variables are filled properly here
  // as the below variable names are just for reference.
  await payload.init({
    local: true,
    mongoURL: MONGODB_URI,
    secret: PAYLOAD_SECRET,
  })

  // For each collection
  await Promise.all(
    payload.config.collections.map(async ({ slug, versions }) => {
      // If drafts are enabled
      if (versions?.drafts) {
        const { docs } = await payload.find({
          collection: slug,
          depth: 0,
          limit: 0,
          locale: 'all',
        })

        const VersionsModel = payload.versions[slug]
        const existingCollectionDocIds: string[] = []
        await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          docs.map(async (doc: any) => {
            existingCollectionDocIds.push(doc.id)
            // Find at least one version for the doc
            const versionDocs = await VersionsModel.find(
              {
                parent: doc.id,
                updatedAt: { $gte: doc.updatedAt },
              },
              null,
              { limit: 1 },
            ).lean()

            // If there are no corresponding versions,
            // we need to create one
            if (versionDocs.length === 0) {
              try {
                await VersionsModel.create({
                  autosave: Boolean(versions?.drafts?.autosave),
                  createdAt: doc.createdAt,
                  parent: doc.id,
                  updatedAt: doc.updatedAt,
                  version: doc,
                })
              } catch (e: unknown) {
                payload.logger.error(
                  `Unable to create version corresponding with collection ${slug} document ID ${doc.id}`,
                  e?.errors || e,
                )
              }

              payload.logger.info(
                `Created version corresponding with ${slug} document ID ${doc.id}`,
              )
            }
          }),
        )

        const versionsWithoutParentDocs = await VersionsModel.deleteMany({
          parent: { $nin: existingCollectionDocIds },
        })

        if (versionsWithoutParentDocs.deletedCount > 0) {
          payload.logger.info(
            `Removing ${versionsWithoutParentDocs.deletedCount} versions for ${slug} collection - parent documents no longer exist`,
          )
        }
      }
    }),
  )

  payload.logger.info('Done!')
  process.exit(0)
}

ensureAtLeastOneVersion()
