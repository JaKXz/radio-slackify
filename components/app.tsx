import React, {ReactNode} from 'react';
import SpotifyPlayer from './spotify-player';
import styles from './app.module.css';
import Link from 'next/link';

type Props = {
  children?: ReactNode;
  // title?: string
};

export default function App({children}: Props) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <Link href="/">Radio Slackify</Link>
        </h1>
        <SpotifyPlayer />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>Radio Slackify</footer>
    </div>
  );
}
