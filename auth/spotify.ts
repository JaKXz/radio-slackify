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

export const spotifyLoginUrl = `${authEndpoint}?${stringify({
  client_id: process.env.SPOTIFY_CLIENT_ID,
  response_type: 'token',
  redirect_uri: `http://localhost:3000/api/spotify-callback`,
  scope: scopes.join('%20'),
  state: '123',
})}`;
