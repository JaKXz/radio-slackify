import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {ApolloProvider} from '@apollo/client';
import apolloClient from '../graphql/apollo-client';
import SpotifyTokenProvider from '../components/spotify-token-provider';

export default function App({Component, pageProps}: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <SpotifyTokenProvider>
        <Component {...pageProps} />
      </SpotifyTokenProvider>
    </ApolloProvider>
  );
}
