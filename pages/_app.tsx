import { AppProps } from 'next/app';

const PayloadApp = (appProps: AppProps): React.ReactElement => {
  const {
    Component,
    pageProps,
  } = appProps;

  return <Component {...pageProps} />
}

export default PayloadApp
