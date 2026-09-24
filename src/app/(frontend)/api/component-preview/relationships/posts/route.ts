const examplePosts = [
  { id: 'example-post-one', title: 'Example post one' },
  { id: 'example-post-two', title: 'Example post two' },
  { id: 'example-post-three', title: 'Example post three' },
]

export function POST(): Response {
  return Response.json({
    docs: examplePosts,
    hasNextPage: false,
    nextPage: null,
    page: 1,
    totalDocs: examplePosts.length,
    totalPages: 1,
  })
}
