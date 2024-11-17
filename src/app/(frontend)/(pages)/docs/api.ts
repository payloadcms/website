export type Topic = {
  docs: Doc[]
  slug: string
}

export type TopicGroup = {
  groupLabel: string
  topics: Topic[]
}

export type Doc = {
  content: string
  desc: any
  headings: any
  keywords: any
  label: any
  order: any
  slug: string
  title: any
}


export const fetchDocs = (ref?: 'v2' | 'v3'): TopicGroup[] => {
  const topics =
    ref === 'v2'
      ? require('../../../../docs/docs-v2.json')
      : require('../../../../docs/docs-v3.json')

  return topics as TopicGroup[]
}


// ///////////// on fetch blog posts pattern
// import config from '@payload-config'
// import { getPayloadHMR } from '@payloadcms/next/utilities'

// export const fetchDocs = async (): Promise<TopicGroup[]> => {
//   const currentDate = new Date()
//   const payload = await getPayloadHMR({ config })

//   const docs = await payload.find({
//     collection: 'docs',
//     depth: 1,
//     limit: 300,
//     sort: '-publishedOn',
//     where: {
//       and: [
//         { publishedOn: { less_than_equal: currentDate } },
//         { _status: { equals: 'published' } },
//       ],
//     },
//   })


//   return topics as TopicGroup[]
// }

// ///////////////////////////////////// from old commit
// export const fetchDocs = async (topicOrder: string[], ref?: string) => {
//   if (!process.env.GITHUB_ACCESS_TOKEN) {
//     return []
//   }

  // const isLive = Boolean(process.env.NEXT_PUBLIC_IS_LIVE)

  // const topics: Topics[] = isLive
  //   ? await Promise.all(
  //       topicOrder.map(async unsanitizedTopicSlug => {
  //         const topicSlug = unsanitizedTopicSlug.toLowerCase()

  //         try {
  //           const docs = await fetch(
  //             `${githubAPI}/contents/docs/${topicSlug}` + (ref ? `?ref=${ref}` : ''),
  //             {
  //               headers,
  //             },
  //           ).then(res => res.json())

  //           if (docs && Array.isArray(docs)) {
  //             const docFilenames = docs.map(({ name }) => name)

  //             const parsedDocs = await Promise.all(
  //               docFilenames.map(async docFilename => await fetchDoc(topicSlug, docFilename, ref)),
  //             )

  //             const topic = {
  //               slug: unsanitizedTopicSlug,
  //               docs: parsedDocs
  //                 .filter<Doc>((doc): doc is Doc => doc !== undefined)
  //                 .sort((a, b) => a.order - b.order),
  //             }

  //             return topic
  //           } else {
  //             if (docs && typeof docs === 'object' && 'message' in docs) {
  //               console.error(`Error fetching ${topicSlug} doc: ${docs.message}`) // eslint-disable-line no-console
  //             }
  //           }
  //         } catch (err) {
  //           console.error(err) // eslint-disable-line no-console
  //         }
  //       }),
  //     )
  //   : ref === 'beta'
  //   ? require('../../../../docs/docs-beta.json')
  //   : require('../../../../docs/docs.json')

//   const topics =
//     ref === 'beta'
//       ? require('../../../../docs/docs-beta.json')
//       : require('../../../../docs/docs.json')

//   return topics as Topics[]
// }