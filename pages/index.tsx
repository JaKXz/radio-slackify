import Head from 'next/head';
import Image from 'next/image';
import useSpotifyToken from '../hooks/use-spotify-token';
import StationList from '../components/station-list';
import styles from '../styles/Home.module.css';
import {useState, useEffect} from 'react';
import Layout from '../components/layout';

export default function Home() {
  const {deleteToken} = useSpotifyToken();
  // const [isTokenExpired, setTokenExpired] = useState(false);

  // const now = new Date('2021-07-23T00:00:00Z');
  // const [currentTrack, setCurrentTrack] = useState<any>({});

  // useEffect(() => {
  // setTokenExpired(isSpotifyTokenExpired);
  // }, [isSpotifyTokenExpired]);

  // useEffect(() => {
  //   const now = new Date();
  //   if (!loading && data) {
  //     setCurrentTrack((prev: any) => {
  //       if (prev) {
  //         const playAt = new Date(prev.playAt);
  //         const endAt = new Date(prev.endAt);

  //         if (playAt <= now && now < endAt) {
  //           console.log('still on same track:', prev);
  //           const spotifyApi = new SpotifyWebApi();
  //           spotifyApi.setAccessToken(spotifyToken);
  //           const seekTo = differenceInSeconds(now, new Date(prev.playAt));
  //           console.log('now', now, 'playAt', prev.playAt, 'seek to', seekTo);
  //           spotifyApi.seek(seekTo * 1000);
  //           spotifyApi.play();
  //           return prev;
  //         }
  //       }

  //       let newTrack;
  //       for (const track of data.tracks) {
  //         // const track = data.tracks[i];
  //         const playAt = new Date(track.playAt);
  //         const endAt = new Date(track.endAt);

  //         if (playAt < now && now < endAt) {
  //           newTrack = track;
  //         }
  //       }
  //       return newTrack;
  //     });
  //   }
  // }, [data, loading]);
  // if (error) {
  //   console.log('error!', error);
  // }

  // console.log('current track', currentTrack);

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

// export function getStaticProps() {
//   return {
//     props: {
//       spotifyLoginUrl,
//     },
//   };
// }
