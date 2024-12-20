export interface LocateResponse {
  country?: string
  isGDPR: boolean
}

export const locate = (): Promise<Response> =>
  fetch('/api/locate', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
