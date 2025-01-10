interface BranchState {
  branches: string[]
  defaultBranch: string
}

interface BranchAction {
  payload: {
    branches: BranchState['branches']
    defaultBranch: string
  }
  type: 'ADD'
}

export const branchReducer = (state: BranchState, action: BranchAction): BranchState => {
  switch (action.type) {
    case 'ADD': {
      return {
        ...state,
        branches: [...(state.branches || []), ...(action.payload.branches || [])],
        defaultBranch: action.payload.defaultBranch || state.defaultBranch,
      }
    }
    default:
      return state
  }
}
