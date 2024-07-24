import YouTube from '../../YouTube/index.js'
import { Banner } from './Banner/index.js'
import BlogImage from './BlogImage/index.js'
import Code from './Code/index.js'
import h1 from './Headings/H1.js'
import h2 from './Headings/H2.js'
import h3 from './Headings/H3.js'
import h4 from './Headings/H4.js'
import h5 from './Headings/H5.js'
import h6 from './Headings/H6.js'
import HR from './HR/index.js'
import InlineCode from './InlineCode/index.js'
import LightDarkImage from './LightDarkImage/index.js'
import { RestExamples } from './RestExamples/index.js'
import Table from './Table/index.js'
import { TableWithDrawers } from './TableWithDrawers/index.js'
import { VideoDrawer } from './VideoDrawer/index.js'

export default {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
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
  VideoDrawer,
}
