import {useState, useEffect, useMemo} from 'react';
import {useRouter} from 'next/router';
import {parse} from 'query-string';
import useLocalStorage from './use-local-storage';
import uniqid from 'uniqid';
import {getValue, setValue} from '../libs/local-storage';

export const useTokenStateSecret = () => {
  const [secret, setSecret] = useLocalStorage('spotifyTokenStateSecret', '');

  useEffect(() => {
    if (!secret) {
      setSecret(uniqid());
    }
  }, [secret]);

  return secret;
};

export default function useSpotifyToken(initialValue = '') {
  const router = useRouter();
  const token = useMemo(() => getValue('spotifyToken', ''), []);
  const expiry = useMemo(() => getValue('spotifyTokenExpiry', 0), []);
  const secret = useMemo(() => getValue('spotifyTokenStateSecret', ''), []);
  const isTokenExpired = useMemo(
    () => () => {
      return expiry < Date.now();
    },
    [expiry],
  );
  const deleteToken = useMemo(
    () => () => {
      setValue('spotifyToken', '');
      setValue('spotifyTokenExpiry', 0);
      setValue('spotifyTokenStateSecret', '');
    },
    [],
  );

  useEffect(() => {
    console.log(token, isTokenExpired());
    if (!token || isTokenExpired()) {
      router.replace(`/login?redirect_to=${router.asPath}`);
    }
  }, [router, token, expiry]);

  useEffect(() => {
    if (router.asPath.includes('access_token')) {
      // Get the auth code from here
      const {access_token, expires_in, state} = parse(
        router.asPath.replace(/\//g, ''),
      );
      console.log(state);
      setValue('spotifyToken', access_token as string);
      setValue('spotifyTokenExpiry', Number(expires_in) * 1000 + Date.now());
      router.replace('/');
    }
  }, [router]);

  return {
    token,
    expiry,
    isTokenExpired,
    deleteToken,
  } as const;
}
