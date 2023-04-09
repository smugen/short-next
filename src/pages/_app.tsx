import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { AuthedUserProvider } from '@/utils/authentication';
import client from '@/utils/graphqlClient';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { Provider } from 'urql';

export const SetGlobalLoadingContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => void 0);

const theme = createTheme({ palette: { mode: 'dark' } });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    const loadingStart = () => setGlobalLoading(true);
    const loadingEnd = () => setGlobalLoading(false);

    router.events.on('routeChangeStart', loadingStart);
    router.events.on('routeChangeComplete', loadingEnd);
    router.events.on('routeChangeError', loadingEnd);

    return () => {
      router.events.off('routeChangeStart', loadingStart);
      router.events.off('routeChangeComplete', loadingEnd);
      router.events.off('routeChangeError', loadingEnd);
    };
  }, [router]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider value={client}>
          <AuthedUserProvider>
            <Backdrop
              sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
              open={globalLoading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <SetGlobalLoadingContext.Provider value={setGlobalLoading}>
              <Component {...pageProps} />
            </SetGlobalLoadingContext.Provider>
          </AuthedUserProvider>
        </Provider>
      </ThemeProvider>
    </>
  );
}
