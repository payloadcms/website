function slugify(string: string): string {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return (
    string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      // Remove all non-word characters
      .replace(/[^\w\-]+/g, '') // eslint-disable-line
      // replace multiple - with single -
      .replace(/\-\-+/g, '-') // eslint-disable-line
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '')
  ) // Trim - from end of text
}

export default slugify
