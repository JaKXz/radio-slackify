import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {parse} from 'query-string';
import useLocalStorage from './use-local-storage';

export default function useSpotifyToken(initialValue = '') {
  const router = useRouter();
  const [spotifyTokenExpiry, setSpotifyTokenExpiry] = useLocalStorage(
    'spotifyTokenExpiry',
    0,
  );
  const [spotifyToken, setSpotifyToken] = useLocalStorage('spotifyToken', '');

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

  return {
    spotifyToken,
    spotifyTokenExpiry,
    isSpotifyTokenExpired: spotifyTokenExpiry < Date.now(),
  } as const;
}
