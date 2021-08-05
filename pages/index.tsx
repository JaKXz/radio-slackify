import Head from 'next/head';
import Image from 'next/image';
import StationList from '../components/station-list';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Home</title>
          <meta name="description" content="home page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <StationList />
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </div>
    </Layout>
  );
}
