import { Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

// TODO: Fix the ESM/TS issue with the `localFont` import
export const untitledSans = localFont({
  src: [
    {
      path: '../../fonts/UntitledSans-Light.woff2',
      style: 'normal',
      weight: '300',
    },
    {
      path: '../../fonts/UntitledSans-LightItalic.woff2',
      style: 'italic',
      weight: '300',
    },
    {
      path: '../../fonts/UntitledSans-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../../fonts/UntitledSans-RegularItalic.woff2',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../../fonts/UntitledSans-Medium.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../../fonts/UntitledSans-MediumItalic.woff2',
      style: 'italic',
      weight: '500',
    },
    {
      path: '../../fonts/UntitledSans-Bold.woff2',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../../fonts/UntitledSans-BoldItalic.woff2',
      style: 'italic',
      weight: '700',
    },
    {
      path: '../../fonts/UntitledSans-Black.woff2',
      style: 'normal',
      weight: '800',
    },
    {
      path: '../../fonts/UntitledSans-BlackItalic.woff2',
      style: 'italic',
      weight: '800',
    },
  ],
  variable: '--font-body',
})
