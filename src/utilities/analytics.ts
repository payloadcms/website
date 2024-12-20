const gaMeasurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const pixelID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

export function analyticsEvent(event: string, value?: unknown): void {
  const Window = window as any // eslint-disable-line @typescript-eslint/no-explicit-any

  if (gaMeasurementID && typeof Window.gtag === 'function') {
    Window.gtag('event', event, value)
  }

  if (pixelID) {
    void import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        if (event === 'page_view') {
          ReactPixel.pageView()
        } else {
          ReactPixel.track(event, value)
        }
      })
  }
}
