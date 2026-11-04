import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)

function load(file, mocks) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    fileName: file,
  })
  const module = { exports: {} }
  vm.runInNewContext(outputText, {
    exports: module.exports,
    module,
    require: (name) => {
      if (name in mocks) return mocks[name]
      if (name === 'react/jsx-runtime') return require(name)
      throw new Error(`Unexpected dependency: ${name}`)
    },
  })
  return module.exports
}

function redirectComponent(to, documents = {}) {
  const lookups = []
  const { PayloadRedirects } = load('src/components/PayloadRedirects/index.tsx', {
    '@utilities/getRedirects': {
      getCachedRedirects: () => async () => [{ from: '/posts/releases/old', to }],
    },
    '@utilities/getDocument': {
      getCachedDocumentByID: (collection, id) => async () => {
        lookups.push([collection, id])
        return documents[id]
      },
    },
    'next/navigation': {
      redirect: (url) => {
        throw new Error(`redirect:${url}`)
      },
      notFound: () => {
        throw new Error('notFound')
      },
    },
  })
  return { PayloadRedirects, lookups }
}

const post = { slug: 'new', category: { slug: 'releases' } }

for (const [name, reference, documents, destination] of [
  ['populated post', { relationTo: 'posts', value: post }, {}, '/posts/releases/new'],
  [
    'post ID',
    { relationTo: 'posts', value: 'post-id' },
    { 'post-id': post },
    '/posts/releases/new',
  ],
  [
    'category ID',
    { relationTo: 'posts', value: { slug: 'new', category: 'cat-id' } },
    { 'cat-id': { slug: 'blog' } },
    '/posts/blog/new',
  ],
  [
    'case study ID',
    { relationTo: 'case-studies', value: 'case-id' },
    { 'case-id': { slug: 'customer' } },
    '/case-studies/customer',
  ],
  [
    'nested page ID',
    { relationTo: 'pages', value: 'page-id' },
    { 'page-id': { breadcrumbs: [{ url: '/parent/child' }] } },
    '/parent/child',
  ],
]) {
  test(`redirects a ${name} to its full path`, async () => {
    const { PayloadRedirects } = redirectComponent({ type: 'reference', reference }, documents)
    await assert.rejects(PayloadRedirects({ url: '/posts/releases/old' }), {
      message: `redirect:${destination}`,
    })
  })
}

test('matches a custom redirect with the full request path', async () => {
  const { PayloadRedirects } = redirectComponent({
    type: 'custom',
    url: 'https://payloadcms.com/posts/blog/new',
  })
  await assert.rejects(PayloadRedirects({ url: '/posts/releases/old' }), {
    message: 'redirect:https://payloadcms.com/posts/blog/new',
  })
  await assert.rejects(PayloadRedirects({ url: '/releases/old' }), { message: 'notFound' })
})

test('uses the selected reference even when a stale custom URL is saved', async () => {
  const { PayloadRedirects } = redirectComponent({
    type: 'reference',
    url: '/stale',
    reference: { relationTo: 'posts', value: post },
  })
  await assert.rejects(PayloadRedirects({ url: 'posts/releases/old' }), {
    message: 'redirect:/posts/releases/new',
  })
})

test('handles missing referenced documents without an invalid redirect', async () => {
  const { PayloadRedirects } = redirectComponent({
    type: 'reference',
    reference: { relationTo: 'posts', value: 'missing' },
  })
  await assert.rejects(PayloadRedirects({ url: '/posts/releases/old' }), { message: 'notFound' })
  assert.equal(await PayloadRedirects({ url: '/posts/releases/old', disableNotFound: true }), null)
})

test('looks up references by ID with the category populated', async () => {
  let query
  const { getCachedDocumentByID } = load('src/utilities/getDocument.ts', {
    '@payload-config': {},
    'next/cache': { unstable_cache: (fn) => fn },
    payload: {
      getPayload: async () => ({
        find: async (args) => {
          query = args
          return { docs: [post] }
        },
      }),
    },
  })
  assert.equal(await getCachedDocumentByID('posts', 'post-id')(), post)
  assert.equal(query.where.id.equals, 'post-id')
  assert.equal(query.depth, 2)
  assert.equal(query.limit, 1)
})

test('invalidates the redirects cache immediately', () => {
  const calls = []
  const { revalidateRedirects } = load('src/hooks/revalidateRedirects.ts', {
    'next/cache': { revalidateTag: (...args) => calls.push(args) },
  })
  const doc = { id: 'redirect-id' }
  assert.equal(revalidateRedirects({ doc, req: { payload: { logger: { info() {} } } } }), doc)
  assert.equal(calls[0][0], 'redirects')
  assert.equal(calls[0][1].expire, 0)
})

function postHooks() {
  const paths = []
  const { Posts } = load('src/collections/Posts.ts', {
    '@root/fields/addToDocs': { addToDocs: {} },
    'next/cache': { revalidatePath: (path) => paths.push(path) },
    '../access/isAdmin': { isAdmin() {} },
    '../access/publishedOnly': { publishedOnly() {} },
    '../blocks/Banner': { Banner: {} },
    '../fields/richText': { default: () => ({}) },
    '../fields/slug': { slugField: () => ({}) },
    '../utilities/formatPreviewURL': { formatPreviewURL() {} },
  })
  const req = { payload: { findByID: async ({ id }) => ({ id, slug: id }) } }
  return { hooks: Posts.hooks, paths, req }
}

test('invalidates the new post and archive on creation without a previous category', async () => {
  const { hooks, paths, req } = postHooks()
  await hooks.afterChange[0]({ doc: { category: 'releases', slug: 'new' }, previousDoc: {}, req })
  assert.deepEqual(paths, ['/posts/releases', '/posts/releases/new'])
})

test('invalidates both old and new paths when a post moves categories', async () => {
  const { hooks, paths, req } = postHooks()
  await hooks.afterChange[0]({
    doc: { category: { id: 'blog' }, slug: 'new' },
    previousDoc: { category: 'releases', slug: 'old' },
    req,
  })
  assert.deepEqual(paths, [
    '/posts/blog',
    '/posts/blog/new',
    '/posts/releases',
    '/posts/releases/old',
  ])
})

test('invalidates the post and archive on deletion', async () => {
  const { hooks, paths, req } = postHooks()
  await hooks.afterDelete[0]({ doc: { category: 'releases', slug: 'old' }, req })
  assert.deepEqual(paths, ['/posts/releases', '/posts/releases/old'])
})

for (const archive of [undefined, { posts: { docs: [] } }]) {
  test(`checks archive redirects when the archive is ${archive ? 'present' : 'missing'}`, async () => {
    const Archive = () => null
    const PayloadRedirects = () => null
    const { default: ArchivePage } = load('src/app/(frontend)/(pages)/posts/[category]/page.tsx', {
      '@components/Archive': { Archive },
      '@components/PayloadRedirects': { PayloadRedirects },
      '@data': { fetchArchive: async () => archive },
      'next/cache': { unstable_cache: (fn) => fn },
      'next/headers': { draftMode: async () => ({ isEnabled: false }) },
      react: require('react'),
    })
    const page = await ArchivePage({ params: Promise.resolve({ category: 'releases' }) })
    const redirect = archive ? page.props.children[0] : page
    assert.equal(redirect.type, PayloadRedirects)
    assert.equal(redirect.props.url, '/posts/releases')
    assert.equal(redirect.props.disableNotFound, archive ? true : undefined)
  })
}

test('passes the complete post path to redirect matching and metadata', async () => {
  const PayloadRedirects = () => null
  const { default: PostPage, generateMetadata } = load(
    'src/app/(frontend)/(pages)/posts/[category]/[slug]/page.tsx',
    {
      '@components/Hero/BreadcrumbsBar/index': {},
      '@components/PayloadRedirects/index': { PayloadRedirects },
      '@components/Post/index': {},
      '@components/RefreshRouterOnSave/index': {},
      '@data': { fetchBlogPost: async () => undefined },
      '@root/seo/mergeOpenGraph': { mergeOpenGraph: (value) => value },
      'next/cache': { unstable_cache: (fn) => fn },
      'next/headers': { draftMode: async () => ({ isEnabled: false }) },
      react: require('react'),
    },
  )
  const params = Promise.resolve({ category: 'releases', slug: 'old' })
  const page = await PostPage({ params })
  assert.equal(page.type, PayloadRedirects)
  assert.equal(page.props.url, '/posts/releases/old')
  assert.equal((await generateMetadata({ params })).openGraph.url, '/posts/releases/old')
})
