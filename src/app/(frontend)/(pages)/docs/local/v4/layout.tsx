import '@payloadcms/v4-preview-runtime/styles.css'
import { payloadV4Inter, payloadV4RobotoMono } from '@root/app/(frontend)/fonts'

export default function LocalPayloadV4DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${payloadV4Inter.variable} ${payloadV4RobotoMono.variable}`}>{children}</div>
  )
}
