import { AppProps } from 'next/app';
import { AdminBar } from '../components/AdminBar';
import { ThemeProvider } from '../components/providers/Theme';
import '../css/app.scss';

const PayloadApp = (
  appProps: AppProps<{
    collection?: string;
    id?: string;
    preview?: boolean
  }>
): React.ReactElement => {
  const {
    Component,
    pageProps,
  } = appProps;

  const {
    collection,
    id,
    preview,
  } = pageProps;

  return (
    <ThemeProvider>
      <AdminBar 
        id={id}
        collection={collection}
        preview={preview}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default PayloadApp
