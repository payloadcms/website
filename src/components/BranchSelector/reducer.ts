interface BranchState {
  branches: string[]
}

interface BranchAction {
  type: 'ADD'
  payload: BranchState['branches']
}

export const branchReducer = (state: BranchState, action: BranchAction): BranchState => {
  switch (action.type) {
    case 'ADD': {
      return {
        ...state,
        branches: [...(state.branches || []), ...(action?.payload || [])],
      }
    }
    default:
      return state
  }
}
