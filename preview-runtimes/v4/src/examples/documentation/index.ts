import type { ComponentDocumentation } from '../types.js'

import { adminDocumentation } from './admin.js'
import { primitiveDocumentation } from './primitives.js'

export const v4ComponentDocumentation: Record<string, ComponentDocumentation> = {
  ...adminDocumentation,
  ...primitiveDocumentation,
}
