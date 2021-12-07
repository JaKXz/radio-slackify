import {ReactNode, createContext, useEffect, useState} from 'react';
import useSpotifyToken from '../hooks/use-spotify-token';
import loadSpotifyPlaybackApi from '../libs/spotify-playback-api';
import {SpotifyCustomWebApi} from '../libs/spotify-custom-web-api';
import {SpotifyWebApi} from 'spotify-web-api-ts';

type Props = {
  children?: ReactNode;
};

type SpotifyApis = {
  playbackApi: Spotify.Player | null;
  customWebApi: SpotifyCustomWebApi | null;
  webApi: SpotifyWebApi | null;
};

export const SpotifyApiContext = createContext<SpotifyApis>({
  playbackApi: null,
  customWebApi: null,
  webApi: null,
});

export default function SpotifyApisProvider({children}: Props) {
  const {token} = useSpotifyToken();
  const [playbackApi, setPlaybackApi] = useState<Spotify.Player | null>(null);
  const [
    isPlaybackApiInitializationStarted,
    setPlaybackApiInitializationStarted,
  ] = useState(false);
  const [customWebApi, setCustomWebApi] = useState<SpotifyCustomWebApi | null>(
    null,
  );
  const [webApi, setWebApi] = useState<SpotifyWebApi | null>(null);

  useEffect(() => {
    if (token && !isPlaybackApiInitializationStarted) {
      setPlaybackApiInitializationStarted(true);
      loadSpotifyPlaybackApi().then(() => {
        const _playbackApi = new Spotify.Player({
          name: 'radio slackify',
          getOAuthToken: (callback) => {
            callback(token);
          },
        });
        _playbackApi.addListener('ready', ({device_id}) => {
          console.log('The Web Playback SDK is ready to play music!');
          // console.log('Device ID', device_id);
          setPlaybackApi(_playbackApi);
          console.log('The Custom Web SDK is ready!');
          setCustomWebApi(new SpotifyCustomWebApi(token, device_id));
        });
        _playbackApi.connect().then((success) => {
          if (success) {
            console.log(
              'The Web Playback SDK successfully connected to Spotify!',
            );
          }
        });
      });
    }
    if (token && !webApi) {
      const _webApi = new SpotifyWebApi();
      _webApi.setAccessToken(token);
      console.log('The Web SDK is ready!');
      setWebApi(_webApi);
    }
  }, [token, playbackApi, webApi, isPlaybackApiInitializationStarted]);

  return (
    <SpotifyApiContext.Provider value={{playbackApi, customWebApi, webApi}}>
      {children}
    </SpotifyApiContext.Provider>
  );
}
