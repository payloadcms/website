import type React from 'react'

export interface ListItemComponentProps {
  active: boolean
}

export interface ListItem {
  anchor: string
  Component: React.ComponentType<ListItemComponentProps>
  id: string
}

export interface Props {
  className?: string
  injectProps?: {
    [prop: string]: unknown
  }
  list: ListItem[]
}

export interface State {
  [id: string]: boolean
}

export interface Action {
  active: boolean
  id: string
}

export type Reducer = (state: State, action: Action) => State

export interface IContext {
  dispatch: (action: Action) => void
  items: State
  lastActive: string | undefined
  setLastActive: (active: string) => void
}

export interface NodeProps {
  children: React.ReactNode
  id: string
  type: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
