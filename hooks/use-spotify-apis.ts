import {useContext} from 'react';
import {SpotifyApiContext} from '../components/spotify-apis-provider';

export default function useSpotifyApis() {
  return useContext(SpotifyApiContext);
}
