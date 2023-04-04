import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { AuthedUserProvider } from '@/utils/authentication';
import client from '@/utils/graphqlClient';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import { Provider } from 'urql';

// import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CssBaseline />
      <Provider value={client}>
        <AuthedUserProvider>
          <Component {...pageProps} />
        </AuthedUserProvider>
      </Provider>
    </>
  );
}
