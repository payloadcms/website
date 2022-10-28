declare module '@mdx-js/mdx' {

  type Compiler = {
    parse: (content: string) => any
  }

  type MDX = {
    createMdxAstCompiler: (options: any) => Compiler
  }

  const content: MDX;
  export default content;
}
