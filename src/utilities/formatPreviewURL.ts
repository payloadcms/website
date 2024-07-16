import { formatPagePath } from './formatPagePath'

export const formatPreviewURL = (
  collection: string,
  doc: any, // eslint-disable-line @typescript-eslint/no-explicit-any
): string => {
  return `${process.env.PAYLOAD_PUBLIC_APP_URL}/api/preview?url=${formatPagePath(
    collection,
    doc,
  )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
}
