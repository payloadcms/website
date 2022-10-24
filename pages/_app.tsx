import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
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

  const router = useRouter();

  const onPreviewExit = useCallback(() => {
    const exit = async () => {
      const exitReq = await fetch('/api/exit-preview');
      if (exitReq.status === 200) {
        router.reload();
      }
    }
    exit();
  }, [router])

  return (
    <ThemeProvider>
      <AdminBar 
        id={id}
        collection={collection}
        preview={preview}
        onPreviewExit={onPreviewExit}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default PayloadApp
