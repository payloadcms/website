import { qs } from '@root/utilities/qs'
import { cookies } from 'next/headers'

const { NEXT_PUBLIC_CMS_URL } = process.env

async function clearDuplicateThreads() {
  const existingThreads = await fetch(`${NEXT_PUBLIC_CMS_URL}/api/community-help?depth=0&limit=0`)
    .then((res) => res.json())
    .then((data) =>
      data.docs.map((thread) => ({
        id: thread.communityHelpType === 'discord' ? thread.discordID : thread.githubID, // Use respective IDs
        communityHelpType: thread.communityHelpType,
        uniqueID: thread.id,
      })),
    )

  const threadGroups = existingThreads.reduce((acc, thread) => {
    const groupId = thread.id
    acc[groupId] = acc[groupId] || []
    acc[groupId].push(thread)
    return acc
  }, {})

  const threadsToDelete: string[] = []
  const cleanedThreads = Object.values(threadGroups).map((group: any[]) => {
    if (group.length > 1) {
      threadsToDelete.push(...group.slice(1).map((thread) => thread.uniqueID)) // Flatten by spreading
    }
    return group[0]
  })

  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  if (!token) {
    throw new Error('You are unauthorized, please log in.')
  }

  const batchNumber = 10
  for (let i = 0; i < threadsToDelete.length; i += batchNumber) {
    const batch = threadsToDelete.slice(i, i + batchNumber)
    await Promise.all(
      batch.map(async (id) => {
        try {
          const res = await fetch(
            `${NEXT_PUBLIC_CMS_URL}/api/community-help?${qs.stringify({
              depth: 0,
              where: { id: { equals: id } },
            })}`,
            {
              credentials: 'include',
              headers: {
                Authorization: `JWT ${token.value}`,
                'Content-Type': 'application/json',
              },
              method: 'DELETE',
            },
          )
          if (!res.ok) {
            throw new Error(`Failed to delete thread with ID: ${id}`)
          }
        } catch (error) {
          console.error('Error deleting thread:', error)
        }
      }),
    )
  }
}

export default clearDuplicateThreads
