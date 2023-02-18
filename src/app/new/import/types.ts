export interface Repo {
  id: string
  name: string
}

export interface Install {
  id: string
  account: {
    id: string
    login: string
  }
}
