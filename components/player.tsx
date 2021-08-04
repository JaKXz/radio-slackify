import useSpotifyToken from '../hooks/use-spotify-token';
import {useQuery, gql} from '@apollo/client';
import {NexusGenFieldTypes} from '../graphql/nexus';
// import SpotifyWebPlayer from 'react-spotify-web-playback';
import {SpotifyWebApi} from 'spotify-web-api-ts';
import {useState, useEffect, useMemo} from 'react';
import {Track} from '@prisma/client';
import {loadApis, Actions} from '../spotify';

// import SpotifyWebPlaybackApi from 'spotify-web-playback';

// const play = ({
//   spotify_uri,
//   playerInstance: {
//     _options: {
//       getOAuthToken,
//       id
//     }
//   }
// }) => {
//   getOAuthToken(access_token => {
//     fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
//       method: 'PUT',
//       body: JSON.stringify({ uris: [spotify_uri] }),
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${access_token}`
//       },
//     });
//   });
// };

// Spotify.Player

type Query = NexusGenFieldTypes['Query'];

const GET_PLAYBACK = gql`
  query StationPlaylist($stationId: ID!) {
    playback(stationId: $stationId) {
      track {
        id
        name
        lengthInSeconds
        spotifyURI
        playAt
        endAt
      }
      timeElapsedInSeconds
    }
  }
`;

export default function Player({stationId}: {stationId: Number}) {
  const {spotifyToken, isSpotifyTokenExpired} = useSpotifyToken();
  const {loading, error, data} = useQuery<Query>(GET_PLAYBACK, {
    variables: {
      stationId,
    },
    // pollInterval: 5000,
  });
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [timeElapsedInSeconds, setTimeElapsedInSeconds] = useState(0);
  // const [webApi, setWebApi] = useState<SpotifyWebApi | null>(null);
  // const [playbackApi, setPlaybackApi] = useState<Spotify.Player | null>(null);
  // const [deviceId, setDeviceId] = useState<string>('');
  const [actions, setActions] = useState<Actions | null>(null);

  useEffect(() => {
    if (data && data.playback) {
      setCurrentTrack(data.playback.track);
      setTimeElapsedInSeconds(data.playback.timeElapsedInSeconds);
    }
  }, [data]);

  useEffect(() => {
    if (!isSpotifyTokenExpired && spotifyToken) {
      loadApis(spotifyToken).then((actions) => {
        setActions(actions);
      });
    }
  }, [spotifyToken, isSpotifyTokenExpired]);

  useEffect(() => {
    if (currentTrack && currentTrack.spotifyURI && actions) {
      // spotifyApi.seek(timeElapsedInSeconds * 1000);
      // spotifyApi.play();
      actions.play(currentTrack.spotifyURI, timeElapsedInSeconds * 1000);
      // playbackApi.seek(timeElapsedInSeconds * 1000);
    }
  }, [currentTrack, timeElapsedInSeconds, actions]);

  // useEffect(() => {
  //   const ddd = async () => {
  //     // const devices = await spotifyApi.player.getMyDevices();
  //     //   console.log(devices);
  //     if (spotifyToken && currentTrack && currentTrack.spotifyURI)
  //     {
  //       // console.log(currentTrack.spotifyURI, timeElapsedInSeconds);
  //       // spotifyApi.setAccessToken(spotifyToken);

  //       // await spotifyWebPlaybackApi.connect(spotifyToken);
  //       // await spotifyPlayer.play(currentTrack.spotifyURI, timeElapsedInSeconds);
  //       // console.log(spotifyPlayer.playing);

  //       // await spotifyWebPlaybackApi.play(currentTrack.spotifyURI);
  //       // await spotifyWebPlaybackApi.pause();
  //       // await spotifyWebPlaybackApi.seek(timeElapsedInSeconds * 1000);
  //       // await spotifyWebPlaybackApi.play();
  //       // spotifyPlayer.

  //       // console.log(spotifyPlayer.playing);

  //       // setTimeout(async () => {
  //       //   console.log(1232);
  //       // console.log(spotifyPlayer.playing);
  //       //   await spotifyPlayer.seek(timeElapsedInSeconds * 1000);
  //       // }, 2000);

  //       // await spotifyApi.player.addToQueue(currentTrack.spotifyURI);
  //       // await spotifyApi.player.play();
  //       // await spotifyApi.player.seek(timeElapsedInSeconds * 1000);
  //     }
  //   }
  //   ddd();
  // }, [spotifyToken, currentTrack]);

  return (
    <div>
      <div>
        {currentTrack && currentTrack.spotifyURI ? (
          <div>Playing...: {currentTrack.name}</div>
        ) : (
          // <SpotifyWebPlayer
          //   token={spotifyToken}
          //   uris={[currentTrack.spotifyURI || '']}
          //   initialVolume={0.5}
          //   autoPlay={true}
          // />

          'No Track'
        )}
      </div>
    </div>
  );
}
