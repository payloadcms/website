export default function DocsLayout({
  children,
  guide,
}: {
  children: React.ReactNode
  guide: string
}) {
  return (
    <>
      {children}
      {guide}
    </>
  )
}
