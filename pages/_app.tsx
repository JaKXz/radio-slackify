import '../styles/globals.css';
import type {AppProps} from 'next/app';
import '../styles/station.css';
import '../styles/stationPlaylist.css';
import {ApolloProvider} from '@apollo/client';

import apolloClient from '../graphql/apollo-client';

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
