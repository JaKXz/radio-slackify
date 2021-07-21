import {useEffect} from 'react';
import {useRouter} from 'next/router';
import SpotifyPlayer from 'react-spotify-web-playback';
import SpotifyWebPlayer, {
  STATUS,
  CallbackState,
} from 'react-spotify-web-playback';
import dynamic from 'next/dynamic';

import useLocalStorage from '../hooks/use-local-storage';

export default function Station() {
  const [spotifyToken, setSpotifyToken] = useLocalStorage('spotifyToken', '');

  return (
    <main>
      <div>
        <SpotifyWebPlayer
          autoPlay={false}
          persistDeviceSelection
          showSaveIcon
          syncExternalDevice
          token={spotifyToken}
          styles={{
            sliderColor: '#1cb954',
          }}
          uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
        />
      </div>
    </main>
  );
}
