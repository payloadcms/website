import type { IFormContext } from '../types'

const initialContext: IFormContext = {
  dispatchFields: () => false,
  fields: {},
  getField: () => undefined,
  getFields: () => ({}),
  initialState: {},
  setHasSubmitted: () => false,
  setIsModified: () => false,
  setIsProcessing: () => false,
  validateForm: () => false,
}

export default initialContext
