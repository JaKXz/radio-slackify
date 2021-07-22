import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import {parse} from 'query-string';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import {seek} from 'react-spotify-web-playback/lib/spotify';

import useLocalStorage from '../hooks/use-local-storage';
import {spotifyLoginUrl} from '../auth/spotify';
import styles from '../styles/Home.module.css';
import Slider from './components/Slider';

const slideData = [
  {
    index: 0,
    headline: 'Shopify EDM',
    src: 'https://wallpaperforu.com/wp-content/uploads/2021/03/Wallpaper-Rezz-Edm-Music-Djs-Dubstep-Trap-Music-1600x17-1.jpg',
    playlistData: [
      {
        id: 1,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://i.scdn.co/image/ab67616d00001e027359994525d219f64872d3b1',
        trackName: 'We will rock you',
      },
      {
        id: 2,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://i.scdn.co/image/ab67616d0000b273b6d4566db0d12894a1a3b7a2',
        trackName: 'Summer Victory Love',
      },
      {
        id: 3,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://www.rollingstone.com/wp-content/uploads/2019/03/bohemian-rhapsody-2.jpg',
        trackName: 'Somebody Else',
      },
    ],
  },
  {
    index: 1,
    headline: '70s Classis',
    src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/forest.jpg',
    playlistData: [
      {
        id: 1,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://i.scdn.co/image/ab67616d00001e027359994525d219f64872d3b1',
        trackName: 'We will rock you',
      },
      {
        id: 2,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://i.scdn.co/image/ab67616d0000b273b6d4566db0d12894a1a3b7a2',
        trackName: 'Summer Victory Love',
      },
      {
        id: 3,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://www.rollingstone.com/wp-content/uploads/2019/03/bohemian-rhapsody-2.jpg',
        trackName: 'Somebody Else',
      },
    ],
  },
  {
    index: 2,
    headline: 'Melody',
    button: 'Listen',
    src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/guitar.jpg',
    playlistData: [
      {
        id: 1,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://i.scdn.co/image/ab67616d00001e027359994525d219f64872d3b1',
        trackName: 'We will rock you',
      },
      {
        id: 2,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://i.scdn.co/image/ab67616d0000b273b6d4566db0d12894a1a3b7a2',
        trackName: 'Summer Victory Love',
      },
      {
        id: 3,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://www.rollingstone.com/wp-content/uploads/2019/03/bohemian-rhapsody-2.jpg',
        trackName: 'Somebody Else',
      },
    ],
  },
  {
    index: 3,
    headline: 'Heavy Metal',
    button: 'Get Focused',
    src: 'https://img4.goodfon.com/wallpaper/nbig/5/d6/heavy-metal-guitar-helmet-star-wars.jpg',
    playlistData: [
      {
        id: 1,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://i.scdn.co/image/ab67616d00001e027359994525d219f64872d3b1',
        trackName: 'We will rock you',
      },
      {
        id: 2,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://i.scdn.co/image/ab67616d0000b273b6d4566db0d12894a1a3b7a2',
        trackName: 'Summer Victory Love',
      },
      {
        id: 3,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
        trackArt:
          'https://www.rollingstone.com/wp-content/uploads/2019/03/bohemian-rhapsody-2.jpg',
        trackName: 'Somebody Else',
      },
    ],
  },
];

const MOCK_STATION_TRACKS = [
  {
    id: 1,
    spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
    playAt: '2021-07-21T20:40:40.691Z',
  },
  {
    id: 2,
    spotifyUri: 'spotify:track:11dFghVXANMlKmJXsNCbNl',
    playAt: '2021-07-21T20:15:40.691Z',
  },
];

export default function Home() {
  const router = useRouter();
  const [spotifyTokenExpiry, setSpotifyTokenExpiry] = useLocalStorage(
    'spotifyTokenExpiry',
    0,
  );
  const [spotifyToken, setSpotifyToken] = useLocalStorage('spotifyToken', '');

  const [currentTrack, setCurrentTrack] = useState<any>({});

  useEffect(() => {
    if (router.asPath.includes('access_token')) {
      // Get the auth code from here
      const {access_token, expires_in} = parse(
        router.asPath.replace(/\//g, ''),
      );
      setSpotifyToken(access_token as string);
      setSpotifyTokenExpiry(Number(expires_in) * 1000 + Date.now());
      router.replace('/');
    }
  }, [router, setSpotifyToken, setSpotifyTokenExpiry]);

  useEffect(() => {
    setCurrentTrack(() => {
      const today = new Date();
      const closest = MOCK_STATION_TRACKS.reduce(
        (a, b) => (new Date(a.playAt) > new Date(b.playAt) ? a : b),
        {playAt: ''},
      );

      console.log(closest);

      return closest;
    });
  }, [setCurrentTrack]);

  console.log(Date.now() - new Date(currentTrack.playAt));

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Slider heading="Example Slider" slides={slideData} />
        <br />
      </main>

      <footer className={styles.footer}>
        {spotifyTokenExpiry < Date.now() ? (
          <a className={styles.SignIn} href={spotifyLoginUrl}>
            Login to Spotify
          </a>
        ) : (
          <SpotifyWebPlayer
            token={spotifyToken}
            uris={[currentTrack.spotifyUri]}
          />
        )}

        {/* <button
          onClick={() =>
            seek(spotifyToken, Date.now() - new Date(currentTrack.playAt))
          }
        >
          seek a bti
        </button> */}
      </footer>
    </div>
  );
}
