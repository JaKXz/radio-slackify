import {stringify} from 'query-string';

const PROTOCOL = process.env.PROTOCOL || 'http';
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const PORT = Number.parseInt(process.env.PORT || '3000');
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

const authEndpoint: string = 'https://accounts.spotify.com/authorize';

const scopes: string[] = [
  'user-library-modify',
  'user-library-read',
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-modify-playback-state',
  'user-read-playback-state',
];

export type SpofityLoginParams = {
  client_id?: string;
  response_type: string;
  redirect_uri: string;
  scope: string;
  state: string;
};

export const spotifyLoginParams: SpofityLoginParams = {
  client_id: CLIENT_ID,
  response_type: 'token',
  redirect_uri: `${PROTOCOL}://${HOSTNAME}:${PORT}/api/spotify-callback`,
  scope: scopes.join('%20'),
  state: '',
};

export const createSpotifyLoginUrl = (state: string = '') =>
  `${authEndpoint}?${stringify({...spotifyLoginParams, state})}`;
