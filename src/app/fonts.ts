import localFont from '@next/font/local'
// eslint-disable-next-line camelcase
import { Roboto_Mono } from '@next/font/google'

export const robotoMono = Roboto_Mono({
  weight: ['400'],
  variable: '--font-mono',
  subsets: ['latin'],
})

export const neueMontrealRegular = localFont({
  src: '../fonts/PPNeueMontreal-Regular.woff2',
  variable: '--font-body',
  weight: '400',
})

export const neueMontrealBold = localFont({
  src: '../fonts/PPNeueMontreal-Bold.woff2',
  variable: '--font-body-bold',
  weight: 'bold',
})

export const neueMontrealItalic = localFont({
  src: '../fonts/PPNeueMontreal-Italic.woff2',
  variable: '--font-body-italic',
  style: 'italic',
})
