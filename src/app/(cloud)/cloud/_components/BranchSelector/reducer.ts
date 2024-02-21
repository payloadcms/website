interface BranchState {
  defaultBranch: string
  branches: string[]
}

interface BranchAction {
  type: 'ADD'
  payload: {
    defaultBranch: string
    branches: BranchState['branches']
  }
}

export const branchReducer = (state: BranchState, action: BranchAction): BranchState => {
  switch (action.type) {
    case 'ADD': {
      return {
        ...state,
        defaultBranch: action.payload.defaultBranch || state.defaultBranch,
        branches: [...(state.branches || []), ...(action.payload.branches || [])],
      }
    }
    default:
      return state
  }
}
