export interface LocateResponse {
  isGDPR: boolean
  country?: string
}

export const locate = (): Promise<Response> =>
  fetch('/api/locate', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
