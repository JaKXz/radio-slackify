// import {SpotifyWebApi} from 'spotify-web-api-ts';

// export async function spotifyAxios<T>(
//   url: string,
//   method: Method,
//   accessToken: string,
//   config?: SpotifyAxiosConfig,
// ) {
//   try {
//     const { contentType, ...axiosConfig } = config ?? {};
//     const response = await axios({
//       ...axiosConfig,
//       baseURL: BASE_API_URL,
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': contentType ?? 'application/json',
//       },
//       paramsSerializer,
//       url,
//       method,
//     });

//     return response.data as T;
//   } catch (error) {
//     const err = error as AxiosError;
//     throw new Error(err.message);
//   }
// }

const spotifyWebApiFetch = async ({
  uri,
  token,
  method = 'get',
  body,
}: {
  uri: string;
  token: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  body?: Object;
}) => {
  const headers = new Headers();
  headers.append('Accept', 'image/jpeg');
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');

  const init = {
    method,
    headers: headers,
    body: JSON.stringify(body),
    // mode: 'cors',
    // cache: 'default'
  };

  // if (typeof body !== 'undefined' && body !== null)
  // {
  //   init['body'] = JSON.stringify(body)
  // }

  const myRequest = new Request(`https://api.spotify.com/v1${uri}`);

  const response = await fetch(myRequest, init);
  // console.log(await response.json());
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

// const setUpWebApi = (token:string) => {
//     const webApi = new SpotifyWebApi();
//     webApi.setAccessToken(token);
//     return webApi;
// };

export type Actions = {
  play: (url: string, position_ms?: number) => Promise<void>;
};

export const loadApis = (token: string) =>
  new Promise<Actions>(async (resolve) => {
    await Promise.all([waitForReady(), loadScript()]);

    const player = new Spotify.Player({
      name: 'radio slackify',
      getOAuthToken: (callback) => {
        callback(token);
      },
      volume: 0.9,
    });

    // const webApi = setUpWebApi(token);

    // webApi.player.play();

    player.addListener('ready', ({device_id}) => {
      console.log('The Web Playback SDK is ready to play music!');
      console.log('Device ID', device_id);
      resolve({
        play: async (uri: string, position_ms = 0) => {
          await spotifyWebApiFetch({
            uri: `/me/player/play?device_id=${device_id}`,
            token,
            method: 'put',
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
