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

export default function StationPlayer({stationId}: {stationId: number}) {
  const {loading, error, data, startPolling, stopPolling} = useQuery<Query>(
    GET_PLAYBACK,
    {
      variables: {
        stationId,
      },
      fetchPolicy: 'no-cache',
    },
  );
  const [stationPlayback, setStationPlayback] = useState<Playback | null>(null);
  const [spofityPlayback, setSpotifyPlayback] =
    useState<Spotify.PlaybackState | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const {playbackApi, customWebApi} = useSpotifyApis();

  useEffect(() => {
    startPolling(5000);
  }, [startPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  useEffect(() => {
    // console.log('polling');
    if (data && data.playback) {
      setStationPlayback(data.playback);
    } else {
      setStationPlayback(null);
    }
  }, [data]);

  useEffect(() => {
    const onStateChanged = (state: Spotify.PlaybackState) => {
      // console.log('player_state_changed', state);
      setSpotifyPlayback(state);
      setPlaying(state && !state.paused);
    };
    playbackApi?.addListener('player_state_changed', onStateChanged);
    playbackApi?.getCurrentState().then((state) => {
      setSpotifyPlayback(state);
      setPlaying(!!state && !state.paused);
    });
    return () => {
      playbackApi?.removeListener('player_state_changed', onStateChanged);
    };
  }, [playbackApi]);

  useEffect(() => {
    if (!customWebApi) return;
    if (!stationPlayback) return;
    if (!stationPlayback.track.spotifyURI) return;
    if (!spofityPlayback) return;
    if (
      spofityPlayback.track_window.current_track.uri ===
      stationPlayback.track.spotifyURI
    )
      return;
    // console.log('next track!');
    customWebApi.play(
      stationPlayback.track.spotifyURI,
      stationPlayback.timeElapsedInSeconds * 1000,
    );
  }, [customWebApi, spofityPlayback, stationPlayback]);

  // console.log(playback, data, error, loading);

  return (
    <div>
      <h2>Radio Station Player</h2>
      {customWebApi ? (
        stationPlayback ? (
          <>
            <ul>
              <li>Track Name:{stationPlayback.track.name}</li>
              <li>Duration:{stationPlayback.track.lengthInSeconds}</li>
              <li>Position:{stationPlayback.timeElapsedInSeconds}</li>
            </ul>
            <button
              onClick={() => {
                customWebApi.play(
                  stationPlayback.track.spotifyURI!,
                  stationPlayback.timeElapsedInSeconds * 1000,
                );
              }}
              disabled={isPlaying}
            >
              Start Playing on Spoitfy
            </button>
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
