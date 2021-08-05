import {ReactNode, createContext, useEffect, useState} from 'react';
import useLocalStorage from '../hooks/use-local-storage';
import {useRouter} from 'next/router';
import {parse} from 'query-string';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import Layout from './layout';
import styles from '../styles/Home.module.css';
import {createSpotifyLoginUrl} from '../auth/spotify';

type Props = {
  children?: ReactNode;
};

type TokenData = {
  token: string;
  expiry: number;
};

export const SpotifyTokenContext = createContext<TokenData>({
  token: '',
  expiry: 0,
});

const {Provider, Consumer} = SpotifyTokenContext;

export default function SpotifyTokenProvider({children}: Props) {
  const [token, setToken] = useLocalStorage('spotify_token', '');
  const [expiry, setExpiry] = useLocalStorage('spotify_token_expiry', 0);
  const [secret, setSecret] = useLocalStorage('spotify_token_state_secret', '');
  const [tokenState, setTokenState] = useState('');
  const router = useRouter();
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    if (!secret) {
      setSecret(uniqid());
    } else {
      setTokenState(jwt.sign({redirectTo: router.asPath}, secret));
    }

    if (router.asPath.includes('access_token')) {
      const {access_token, expires_in, state} = parse(
        router.asPath.replace(/\//g, ''),
      );
      try {
        const payload = jwt.verify(String(state), secret) as {
          redirectTo: string;
        };
        setToken(access_token as string);
        setExpiry(Number(expires_in) * 1000 + Date.now());
        // console.log(payload);
        router.replace(payload.redirectTo);
      } catch (error) {
        console.error(error);
        setTokenError('Failed to get an access token.');
      }
    }
  }, [router, secret]);

  // if (isProceccing) {
  //   return (
  //     <Layout>
  //       <div className={styles.container}>
  //         <main className={styles.main}>Plear wait...</main>
  //       </div>
  //     </Layout>
  //   );
  // }

  return token && tokenState ? (
    <Provider value={{token, expiry}}>{children}</Provider>
  ) : (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          {tokenError && <p>{tokenError}</p>}
          <a className={styles.SignIn} href={createSpotifyLoginUrl(tokenState)}>
            Login to Spotify
          </a>
        </main>
      </div>
    </Layout>
  );
}
