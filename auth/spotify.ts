import {stringify} from 'query-string';

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
  client_id: process.env.SPOTIFY_CLIENT_ID,
  response_type: 'token',
  redirect_uri: `http://localhost:3000/api/spotify-callback`,
  scope: scopes.join('%20'),
  state: '',
};

export const spofityTokenStateSecret = process.env.SPOTIFY_TOKEN_STATE_SECRET;

export const createSpotifyLoginUrl = (params: SpofityLoginParams) =>
  `${authEndpoint}?${stringify(params)}`;
