import matter from 'gray-matter'

function decodeBase64(string: string) {
  const buff = Buffer.from(string, 'base64')
  return buff.toString('utf8')
}

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

const githubAPI = 'https://api.github.com/repos/payloadcms/payload'

const headers = {
  Accept: 'application/vnd.github.v3+json.html',
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

async function getHeadings(source) {
  const headingLines = source.split('\n').filter(line => {
    return line.match(/^#{1,3}\s.+/gm)
  })

  return headingLines.map(raw => {
    const text = raw.replace(/^###*\s/, '')
    const level = raw.slice(0, 3) === '###' ? 3 : 2
    return { text, level, id: slugify(text) }
  })
}

export type Topics = {
  slug: string
  docs: Doc[]
}

export type Doc = {
  content: string
  title: any
  slug: string
  label: any
  order: any
  desc: any
  keywords: any
  headings: any
}

// Doc
export async function fetchDoc(topic: string, slug: string, ref?: string) {
  try {
    const res = await fetch(
      `${githubAPI}/contents/docs/${topic}/${slug}` + (ref ? `?ref=${ref}` : ''),
      {
        headers,
      },
    )
    const data = await res.json()

    const parsedDoc = matter(decodeBase64(data.content))

    parsedDoc.content = parsedDoc.content
      .replace(/\(\/docs\//g, '(../')
      .replace(/"\/docs\//g, '"../')
      .replace(/https:\/\/payloadcms.com\/docs\//g, '../')

    const doc = {
      content: parsedDoc.content,
      title: parsedDoc.data.title,
      slug: slug,
      label: parsedDoc.data.label,
      order: parsedDoc.data.order,
      desc: parsedDoc.data.desc || '',
      keywords: parsedDoc.data.keywords || '',
      headings: await getHeadings(parsedDoc.content),
    }

    return doc
  } catch (error) {
    console.error(error)
  }
}

export const fetchDocs = async (topicOrder: string[], ref?: string) => {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    return []
  }

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

  const topics =
    ref === 'beta'
      ? require('../../../../docs/docs-beta.json')
      : require('../../../../docs/docs.json')

  return topics as Topics[]
}
