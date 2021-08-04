const spotifyWebApiFetch = async ({
  uri,
  token,
  method = 'post',
  body = null,
}: {
  uri: string;
  token: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  body?: Object | null;
}) => {
  fetch(`https://api.spotify.com/v1${uri}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const loadScript = () => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'spotify-player';
    script.type = 'text/javascript';
    script.async = false;
    script.defer = true;
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Error loading spotify-player.js'));
    document.head.appendChild(script);
  });
};

const waitForReady = () => {
  return new Promise<void>((resolve) => {
    const initialize = () => {
      resolve();
    };
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = initialize;
    } else {
      initialize();
    }
  });
};

export type Actions = {
  play: (url: string, position_ms?: number) => Promise<void>;
  // addToQueue: (url: string) => Promise<void>;
};

export const loadActions = (token: string) =>
  new Promise<Actions>(async (resolve) => {
    await Promise.all([waitForReady(), loadScript()]);

    const player = new Spotify.Player({
      name: 'radio slackify',
      getOAuthToken: (callback) => {
        callback(token);
      },
      volume: 0.9,
    });

    player.addListener('ready', ({device_id}) => {
      console.log('The Web Playback SDK is ready to play music!');
      console.log('Device ID', device_id);
      resolve({
        play: async (uri: string, position_ms) => {
          await spotifyWebApiFetch({
            uri: `/me/player/play?device_id=${device_id}`,
            method: 'put',
            token,
            body: {
              uris: [uri],
              position_ms,
            },
          });
        },
      });
    });

    player.connect().then((success) => {
      if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
      }
    });

    // player.addListener('player_state_changed', ({
    //     position,
    //     duration,
    //     track_window: { current_track }
    // }) => {
    //     console.log('Currently Playing', current_track);
    //     console.log('Position in Song', position);
    //     console.log('Duration of Song', duration);
    // });
  });
