import {stringify} from 'query-string';

const authEndpoint: string = 'https://accounts.spotify.com/authorize';

const scope: string[] = [
  'playlist-read-collaborative',
  'playlist-modify-public',
  'user-top-read',
  'playlist-read-private',
  'playlist-modify-private',
  'user-follow-read',
  'user-read-recently-played',
  'user-library-read',
];

export const spotifyLoginUrl = `${authEndpoint}?${stringify({
  client_id: process.env.SPOTIFY_CLIENT_ID,
  response_type: 'token',
  redirect_uri: `http://localhost:3000/api/spotify-callback`,
  scope,
  state: '123',
})}`;
