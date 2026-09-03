export const versionToBranch = {
  v2: '2.x',
  v3: '3.x',
  v4: 'main',
} as const

export type DocVersion = keyof typeof versionToBranch
export type DocBranch = (typeof versionToBranch)[DocVersion]

export function isDocVersion(version: unknown): version is DocVersion {
  return typeof version === 'string' && version in versionToBranch
}

export function branchForVersion(version: unknown): DocBranch {
  if (isDocVersion(version)) {
    return versionToBranch[version]
  }
  return versionToBranch.v3
}

export function docsBasePathForVersion(version: unknown): '/docs' | '/docs/beta' | '/docs/v2' {
  if (version === 'v2') {
    return '/docs/v2'
  }

  if (version === 'v4') {
    return '/docs/beta'
  }

  return '/docs'
}

const defaultBranches: readonly string[] = Object.values(versionToBranch)

export function isDefaultBranch(branch: unknown): boolean {
  return typeof branch === 'string' && defaultBranches.includes(branch)
}
