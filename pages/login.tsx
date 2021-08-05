import Head from 'next/head';
import {
  spotifyLoginParams,
  createSpotifyLoginUrl,
  SpofityLoginParams,
  spofityTokenStateSecret,
} from '../auth/spotify';
import styles from '../styles/Home.module.css';
import {useState, useEffect} from 'react';
import Layout from '../components/layout';
import {useRouter} from 'next/router';
import jwt from 'jsonwebtoken';
import {useTokenStateSecret} from '../hooks/use-spotify-token';

type Props = {
  spotifyLoginParams: SpofityLoginParams;
  spofityTokenStateSecret: string;
};

export default function Login({
  spotifyLoginParams,
  spofityTokenStateSecret,
}: Props) {
  const router = useRouter();
  const [spotifyTokenState, setSpotifyTokenState] = useState('');
  const secret = useTokenStateSecret();

  useEffect(() => {
    if (secret) setSpotifyTokenState(jwt.sign({}, secret));
  }, [secret]);

  useEffect(() => {
    const redirectTo = router.query['redirect_to'];
    if (secret && redirectTo && typeof redirectTo === 'string') {
      setSpotifyTokenState(jwt.sign({redirectTo}, secret));
    }
  }, [secret, router]);

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Login</title>
          <meta name="description" content="login page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <a
            className={styles.SignIn}
            href={createSpotifyLoginUrl({
              ...spotifyLoginParams,
              state: spotifyTokenState,
            })}
          >
            Login to Spotify
          </a>
        </main>
      </div>
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      spotifyLoginParams,
      spofityTokenStateSecret,
    },
  };
}
