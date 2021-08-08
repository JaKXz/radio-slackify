import {useEffect, useState} from 'react';
import useLocalStorage from '../hooks/use-local-storage';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import Layout from './layout';
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
  }, [secret, isSecretInitialized]);

  useEffect(() => {
    if (secret && !tokenState) {
      setTokenState(jwt.sign({redirectTo}, secret));
    }
  }, [secret, tokenState]);

  if (tokenState)
    return (
      <Layout>
        <div className={styles.container}>
          <main className={styles.main}>
            <a
              className={styles.SignIn}
              href={createSpotifyLoginUrl(tokenState)}
            >
              Login to Spotify
            </a>
          </main>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <p>Please wait...</p>
    </Layout>
  );
}
