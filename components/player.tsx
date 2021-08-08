import {useQuery, gql} from '@apollo/client';
import {NexusGenFieldTypes} from '../graphql/nexus';
import {useState, useEffect} from 'react';
import {Track} from '@prisma/client';
import {loadActions, Actions} from '../spotify';

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

export default function Player({
  spotifyToken,
  stationId,
}: {
  spotifyToken: string;
  stationId: number;
}) {
  const {loading, error, data} = useQuery<Query>(GET_PLAYBACK, {
    variables: {
      stationId,
    },
    pollInterval: 5000,
  });
  const [playback, setPlayback] = useState<Playback | null>(null);
  const [actions, setActions] = useState<Actions | null>(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (data && data.playback) {
      setPlayback(data.playback);
    }
  }, [data]);

  useEffect(() => {
    loadActions(spotifyToken).then((actions) => {
      setActions(actions);
    });
  }, []);

  useEffect(() => {
    if (actions) {
      actions.addListener('player_state_changed', (state) => {
        if (state) {
          setPaused(state.paused);
        }
        // console.log(state);
      });
    }
  }, [actions]);

  return (
    <div>
      <div>
        {playback && actions ? (
          <div>
            <p>Currently playing:{playback.track.name}</p>
            <button
              onClick={() => {
                if (playback.track.spotifyURI) {
                  actions.play(
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
