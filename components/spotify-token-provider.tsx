import {ReactNode, createContext, useEffect, useState} from 'react';
import useLocalStorage from '../hooks/use-local-storage';
import {useRouter} from 'next/router';
import {parse} from 'query-string';
import jwt from 'jsonwebtoken';
// import uniqid from 'uniqid';
// import Layout from './layout';
// import styles from '../styles/Home.module.css';
// import {createSpotifyLoginUrl} from '../auth/spotify';
import Login from './login';

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

export default function SpotifyTokenProvider({children}: Props) {
  const [token, setToken] = useLocalStorage('spotify_token', '');
  const [expiry, setExpiry] = useLocalStorage('spotify_token_expiry', 0);
  const [secret, setSecret] = useLocalStorage('spotify_token_state_secret', '');
  const [isTokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (router.asPath.includes('access_token') && secret) {
      const {access_token, expires_in, state} = parse(
        router.asPath.replace(/\//g, ''),
      );
      try {
        const payload = jwt.verify(String(state), secret) as {
          redirectTo: string;
        };
        setToken(access_token as string);
        setExpiry(Number(expires_in) * 1000 + Date.now());
        router.replace(payload.redirectTo);
      } catch (error) {
        console.error(error);
        setTokenError('Failed to get an access token.');
      }
    }
  }, [router, secret]);

  useEffect(() => {
    const timeLeft = expiry - Date.now();
    if (token && timeLeft > 0) {
      setTokenValid(true);
      // console.log(timeLeft / 1000);
      setTimeout(() => {
        setTokenValid(false);
      }, timeLeft);
    }
  }, [expiry, token]);

  // console.log(token, expiry, secret, tokenState);
  if (isTokenValid)
    return (
      <SpotifyTokenContext.Provider value={{token, expiry}}>
        {children}
      </SpotifyTokenContext.Provider>
    );
  else
    return (
      <div>
        {tokenError && <p>{tokenError}</p>}
        <Login redirectTo={router.asPath} />
      </div>
    );
}
