import type { Install } from '@cloud/_api/fetchInstalls'

export interface InstallationSelectorProps {
  className?: string
  description?: string
  disabled?: boolean
  error?: string
  hideLabel?: boolean
  installs?: Install[]
  loading?: boolean
  onChange?: (value?: Install) => void
  onInstall?: () => void
  uuid: string
  value?: Install['id']
}
