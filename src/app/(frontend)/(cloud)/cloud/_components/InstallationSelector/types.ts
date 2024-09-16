import type { Install } from '@cloud/_api/fetchInstalls.js'

export interface InstallationSelectorProps {
  value?: Install['id']
  onChange?: (value?: Install) => void // eslint-disable-line no-unused-vars
  installs?: Install[]
  onInstall?: () => void
  loading?: boolean
  error?: string
  description?: string
  disabled?: boolean
  hideLabel?: boolean
  className?: string
  uuid: string
}
