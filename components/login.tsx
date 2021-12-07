import {useEffect, useState} from 'react';
import useLocalStorage from '../hooks/use-local-storage';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
// import Layout from './app';
import styles from '../styles/Home.module.css';
import {createSpotifyLoginUrl} from '../auth/spotify';

export default function Login({redirectTo}: {redirectTo: string}) {
  const [secret, setSecret, isSecretInitialized] = useLocalStorage(
    'spotify_token_state_secret',
    '',
  );
  const [tokenState, setTokenState] = useState('');

  useEffect(() => {
    if (isSecretInitialized && !secret) {
      setSecret(uniqid());
    }
  }, [secret, setSecret, isSecretInitialized]);

  useEffect(() => {
    if (secret && !tokenState) {
      setTokenState(jwt.sign({redirectTo}, secret));
    }
  }, [secret, redirectTo, tokenState]);

  if (tokenState)
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <a className={styles.SignIn} href={createSpotifyLoginUrl(tokenState)}>
            Login to Spotify
          </a>
        </main>
      </div>
    );

  return <p>Please wait...</p>;
}
