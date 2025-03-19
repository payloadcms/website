export const getVideo: (videoUrl: string) => {
  id: string
  platform: 'vimeo' | 'youtube'
  start: number
} = (videoUrl: string) => {
  return {
    id: videoUrl.includes('youtube')
      ? videoUrl.split('v=')[1].split('&')[0] || ''
      : videoUrl.split('/').pop()?.split('?')[0] || '',
    platform: videoUrl.includes('vimeo') ? 'vimeo' : 'youtube',
    start: videoUrl.includes('t=') ? parseInt(videoUrl.split('t=').pop() || '0') : 0,
  }
}
