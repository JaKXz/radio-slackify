import {useContext} from 'react';
import {SpotifyTokenContext} from '../components/spotify-token-provider';

export default function useSpotifyToken() {
  return useContext(SpotifyTokenContext);
}
