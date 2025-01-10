import { cloudSlug } from '@cloud/slug'

type Args = {
  environmentSlug?: string
  projectSlug: string
  suffix?: string
  teamSlug: string
}

export function generateRoutePath({
  environmentSlug,
  projectSlug,
  suffix,
  teamSlug,
}: Args): string {
  return `/${cloudSlug}/${teamSlug}/${projectSlug}${
    environmentSlug ? `/env/${environmentSlug}` : ''
  }${suffix ? `/${suffix}` : ''}`
}
