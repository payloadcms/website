import { formatPagePath } from './formatPagePath'

export const formatPreviewURL = (
  collection: string,
  doc: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  category?: string,
): string => {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/api/preview?url=${formatPagePath(
    collection,
    doc,
    category,
  )}&secret=${process.env.NEXT_PRIVATE_DRAFT_SECRET}`
}
