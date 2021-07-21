import {useState, useEffect} from "react";
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'

import { redirectUri, clientId, scopes, authEndpoint, responseType } from './auth/auth';

import styles from '../styles/Home.module.css'

export default function Home() {
  const router = useRouter()
  const [tracks, setTracks] = useState<any>([]);

  useEffect(() => {
    fetch('/api/track').then(res => res.json()).then(track => setTracks((prev: any) => prev.concat(track)));
  }, []);

  let params: URLSearchParams = new URLSearchParams({
    client_id: encodeURI(clientId),
    redirect_uri: encodeURI(redirectUri),
    scope: scopes.join('%20'),
    response_type: encodeURI(responseType),
  });

  useEffect(() => {
    if(window.location.href.indexOf("access_token")){
      // Get the auth code from here
      console.log(window.location.href)
      router.push('/')
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <a className="sign-in-button" href={authEndpoint + params.toString()}>
        Login to Spotify
      </a>

      <main className={styles.main}>
        {tracks.map((track: any) => (
          <div key={track.id}><pre>{JSON.stringify(track, null, 2)}</pre></div>
        ))}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
