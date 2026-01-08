import { getPayload } from 'payload'
import config from '@payload-config'

async function clearDuplicateThreads() {
  const payload = await getPayload({ config })

  const existingThreadsResult = await payload.find({
    collection: 'community-help',
    depth: 0,
    limit: 0,
    overrideAccess: true,
  })

  const existingThreads = existingThreadsResult.docs.map((thread) => ({
    id: (thread.communityHelpType === 'discord' ? thread.discordID : thread.githubID) as string, // Use respective IDs
    communityHelpType: thread.communityHelpType,
    uniqueID: thread.id,
  }))

  const threadGroups = existingThreads.reduce(
    (acc, thread) => {
      const groupId = thread.id
      acc[groupId] = acc[groupId] || []
      acc[groupId].push(thread)
      return acc
    },
    {} as Record<string, typeof existingThreads>,
  )

  const threadsToDelete: string[] = []
  const cleanedThreads = Object.values(threadGroups).map((group: any[]) => {
    if (group.length > 1) {
      threadsToDelete.push(...group.slice(1).map((thread) => thread.uniqueID)) // Flatten by spreading
    }
    return group[0]
  })

  console.log(`[clearDuplicateThreads] Found ${threadsToDelete.length} duplicate threads to delete`)

  const batchNumber = 10
  for (let i = 0; i < threadsToDelete.length; i += batchNumber) {
    const batch = threadsToDelete.slice(i, i + batchNumber)
    await Promise.all(
      batch.map(async (id) => {
        try {
          await payload.delete({
            id,
            collection: 'community-help',
            overrideAccess: true,
          })
          console.log(`[clearDuplicateThreads] Successfully deleted thread with ID: ${id}`)
        } catch (error) {
          console.error(`[clearDuplicateThreads] Error deleting thread ${id}:`, error)
        }
      }),
    )
  }

  console.log('[clearDuplicateThreads] Cleanup completed!')
}

export default clearDuplicateThreads
