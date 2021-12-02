import {useQuery, gql} from '@apollo/client';
import {NexusGenFieldTypes} from '../graphql/nexus';
import {useState, useEffect} from 'react';
import useSpotifyApis from '../hooks/use-spotify-apis';

type Query = NexusGenFieldTypes['Query'];
type Playback = NexusGenFieldTypes['Playback'];

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

export default function Player({stationId}: {stationId: number}) {
  const {loading, error, data} = useQuery<Query>(GET_PLAYBACK, {
    variables: {
      stationId,
    },
    pollInterval: 5000,
  });
  const [playback, setPlayback] = useState<Playback | null>(null);
  const [paused, setPaused] = useState(true);
  const {playbackApi, customWebApi} = useSpotifyApis();

  useEffect(() => {
    if (data && data.playback) {
      setPlayback(data.playback);
    } else {
      setPlayback(null);
    }
  }, [data]);

  useEffect(() => {
    const onStateChanged = (state: Spotify.PlaybackState) => {
      console.log('player_state_changed', state, playback);
      if (state) {
        setPaused(state.paused);
      }
    };
    playbackApi?.addListener('player_state_changed', onStateChanged);
    return () => {
      playbackApi?.removeListener('player_state_changed', onStateChanged);
    };
  }, [playbackApi]);

  useEffect(() => {
    if (!paused && customWebApi && playback && playback.track.spotifyURI) {
      customWebApi.play(
        playback.track.spotifyURI,
        playback.timeElapsedInSeconds * 1000,
      );
    }
  }, [paused]);

  // console.log(playback, data, error, loading);

  return (
    <div>
      {customWebApi ? (
        playback ? (
          <>
            <p>Current Track:{playback.track.name}</p>
            {paused ? (
              <button
                onClick={() => {
                  customWebApi.play(
                    playback.track.spotifyURI!,
                    playback.timeElapsedInSeconds * 1000,
                  );
                }}
              >
                Start Playing
              </button>
            ) : (
              <button
                onClick={() => {
                  customWebApi.pause();
                }}
              >
                Stop Playing
              </button>
            )}
          </>
        ) : (
          <p>No track is currently being played.</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
