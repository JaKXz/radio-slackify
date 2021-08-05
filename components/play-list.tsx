import {useQuery, gql} from '@apollo/client';
import {NexusGenFieldTypes} from '../graphql/nexus';
import {useState, useEffect, useMemo} from 'react';
import {Track} from '@prisma/client';
import {format} from 'date-fns';

type Query = NexusGenFieldTypes['Query'];

const GET_PLAY_LIST = gql`
  query StationPlaylist($stationId: ID!, $from: String!) {
    tracks(from: $from, stationId: $stationId) {
      id
      name
      lengthInSeconds
      spotifyURI
      playAt
      endAt
    }
  }
`;

export default function PlayList({
  spotifyToken,
  stationId,
}: {
  spotifyToken: string;
  stationId: number;
}) {
  const {loading, error, data} = useQuery<Query>(GET_PLAY_LIST, {
    variables: {
      stationId,
      from: new Date('2021-08-01T13:33:18.688Z'),
    },
    // pollInterval: 2000,
  });
  const [list, setList] = useState<Track[]>([]);

  useEffect(() => {
    if (data) {
      setList(data.tracks);
    }
  }, [data]);

  return list.length > 0 ? (
    <ul>
      {list.map((item) => (
        <li key={item.id}>
          <h3>{item.name}</h3>
          <p>Play at: {format(new Date(item.playAt), 'MMM dd, yyyy ah:m:s')}</p>
          {item.endAt && (
            <p>End at: {format(new Date(item.endAt), 'MMM dd, yyyy ah:m:s')}</p>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p>No Play List</p>
  );
}
