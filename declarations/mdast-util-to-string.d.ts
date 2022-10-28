declare module 'mdast-util-to-string' {

  type MDASTToString = (content: any) => string

  const mdastToString: MDASTToString;
  export default mdastToString;
}
