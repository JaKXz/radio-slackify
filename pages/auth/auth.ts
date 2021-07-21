export const authEndpoint: string = 'https://accounts.spotify.com/authorize?';

export const scopes: string[] = [
  'playlist-read-collaborative',
  'playlist-modify-public',
  'user-top-read',
  'playlist-read-private',
  'playlist-modify-private',
  'user-follow-read',
  'user-read-recently-played',
  'user-library-read',
];

export const responseType: string = 'token';

export const clientId: string = '2ad13e2f30cc4931b6b3c2575b865287';

export const redirectUri: string = 'http://localhost:3000';
