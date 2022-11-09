import React from 'react'
import { RenderLayout } from './renderLayout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <RenderLayout>{children}</RenderLayout>
}
