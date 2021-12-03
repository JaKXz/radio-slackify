import React, {ReactNode} from 'react';
import SpotifyPlaybackViewer from './spotify-playback-viewer';
import styles from './app.module.css';

type Props = {
  children?: ReactNode;
  // title?: string
};

export default function App({children}: Props) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Radio Slackify</h1>
        <SpotifyPlaybackViewer />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>Radio Slackify</footer>
    </div>
  );
}
