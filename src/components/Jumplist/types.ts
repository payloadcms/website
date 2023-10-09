import type React from 'react'

export interface ListItemComponentProps {
  active: boolean
}

export interface ListItem {
  id: string
  Component: React.ComponentType<ListItemComponentProps>
}

export interface Props {
  list: ListItem[]
  className?: string
  injectProps?: {
    [prop: string]: unknown
  }
}

export interface State {
  [id: string]: boolean
}

export interface Action {
  id: string
  active: boolean
}

export type Reducer = (state: State, action: Action) => State

export interface IContext {
  dispatch: (action: Action) => void
  items: State
  lastActive: string | undefined
  setLastActive: (active: string) => void
}

export interface NodeProps {
  id: string
  children: React.ReactNode
  type: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
