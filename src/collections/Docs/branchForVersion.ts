const versionToBranch = {
  v2: '2.x',
  v3: '3.x',
} as const

export type DocVersion = keyof typeof versionToBranch
export type DocBranch = (typeof versionToBranch)[DocVersion]

export function branchForVersion(version: unknown): DocBranch {
  if (typeof version === 'string' && version in versionToBranch) {
    return versionToBranch[version as DocVersion]
  }
  return versionToBranch.v3
}

const defaultBranches: readonly string[] = Object.values(versionToBranch)

export function isDefaultBranch(branch: unknown): boolean {
  return typeof branch === 'string' && defaultBranches.includes(branch)
}
