import { Banner } from '../../Banner'
import YouTube from '../../YouTube'
import BlogImage from './BlogImage'
import Code from './Code'
import h1 from './H1'
import h2 from './H2'
import h3 from './H3'
import HR from './HR'
import InlineCode from './InlineCode'
import LightDarkImage from './LightDarkImage'
import { RestExamples } from './RestExamples'
import Table from './Table'
import { TableWithDrawers } from './TableWithDrawers'
import tableDrawers from './TableWithDrawers/drawers'

export default {
  h1,
  h2,
  h3,
  Banner,
  pre: Code,
  code: InlineCode,
  HR,
  BlogImage,
  YouTube,
  RestExamples,
  table: Table,
  LightDarkImage,
  TableWithDrawers,
  ...tableDrawers,
}
