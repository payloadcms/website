import { AppProps } from 'next/app';
import { ThemeProvider } from '../components/providers/Theme';
import '../css/app.scss';

const PayloadApp = (appProps: AppProps): React.ReactElement => {
  const {
    Component,
    pageProps,
  } = appProps;

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default PayloadApp
