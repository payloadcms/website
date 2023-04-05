export const metadata = {
  title: {
    template: '%s | FUCK',
    default: 'Payload FUCK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payload CMS',
    description: 'The Node & React TypeScript Headless CMS',
    creator: '@payloadcms',
  },
}

export default ({ children }) => {
  return <div>{children}</div>
}
