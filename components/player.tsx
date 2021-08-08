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
    }
  }, [data]);

  useEffect(() => {
    if (playbackApi) {
      playbackApi.addListener('player_state_changed', (state) => {
        if (state) {
          setPaused(state.paused);
        }
      });
    }
  }, [playbackApi]);

  return (
    <div>
      <div>
        {playback && customWebApi ? (
          <div>
            <p>Currently playing:{playback.track.name}</p>
            <button
              onClick={() => {
                if (playback.track.spotifyURI && customWebApi) {
                  customWebApi.play(
                    playback.track.spotifyURI,
                    playback.timeElapsedInSeconds * 1000,
                  );
                }
              }}
              disabled={!paused}
            >
              Start Playing
            </button>
          </div>
        ) : (
          'No Track'
        )}
      </div>
    </div>
  );
}
