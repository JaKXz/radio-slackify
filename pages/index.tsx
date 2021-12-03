import Head from 'next/head';
import Image from 'next/image';
import StationList from '../components/station-list';
import styles from '../styles/index-page.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <StationList />
      </div>
    </>
  );
}
