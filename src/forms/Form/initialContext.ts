import type { IFormContext } from '../types'

const initialContext: IFormContext = {
  initialState: {},
  fields: {},
  validateForm: () => false,
  setIsModified: () => false,
  setIsProcessing: () => false,
  setHasSubmitted: () => false,
  dispatchFields: () => false,
  getFields: () => ({}),
  getField: () => undefined,
}

export default initialContext
