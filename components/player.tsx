import useSpotifyToken from '../hooks/use-spotify-token';
import {useQuery, gql} from '@apollo/client';
import {NexusGenFieldTypes} from '../graphql/nexus';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import SpotifyWebApi from 'spotify-web-api-js';
import {useState, useEffect, useMemo} from 'react';
import {Track} from '@prisma/client';

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
  const {spotifyToken} = useSpotifyToken();
  const {loading, error, data} = useQuery<Query>(GET_PLAYBACK, {
    variables: {
      stationId: stationId,
    },
    // pollInterval: 2000,
  });
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [timeElapsedInSeconds, setTimeElapsedInSeconds] = useState(0);
  const spotifyApi = useMemo(() => new SpotifyWebApi(), []);

  useEffect(() => {
    spotifyApi.setAccessToken(spotifyToken);
  }, [spotifyToken]);

  useEffect(() => {
    if (data && data.playback) {
      setCurrentTrack(data.playback.track);
      setTimeElapsedInSeconds(data.playback.timeElapsedInSeconds);
    }
  }, [data]);

  useEffect(() => {
    if (currentTrack) {
      spotifyApi.seek(timeElapsedInSeconds * 1000);
      spotifyApi.play();
    }
  }, [currentTrack, timeElapsedInSeconds]);

  console.log(currentTrack);

  return (
    <div>
      <div>
        {currentTrack ? (
          <SpotifyWebPlayer
            token={spotifyToken}
            uris={[currentTrack.spotifyURI || '']}
            initialVolume={0.5}
            autoPlay={true}
          />
        ) : (
          'No Track'
        )}
      </div>
    </div>
  );
}
