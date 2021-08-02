import {useState, useEffect} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import {useQuery, gql} from '@apollo/client';
import {NexusGenFieldTypes} from '../graphql/nexus';
import Link from 'next/link';

type Query = NexusGenFieldTypes['Query'];
type Station = {
  id: number;
  name: string;
};

const GET_STATION_LIST = gql`
  query Query {
    stations {
      id
      name
      meta {
        name
      }
    }
  }
`;

export default function StationList() {
  const {loading, error, data} = useQuery<Query>(GET_STATION_LIST);
  const [stations, setStations] = useState([] as Station[]);

  useEffect(() => {
    if (data) {
      setStations(data.stations);
    }
    return () => {
      setStations([]);
    };
  }, [data]);

  return (
    <div>
      <h3>Stations</h3>
      {stations.length > 0 && (
        <ul>
          {stations.map((station) => (
            <li key={station.id}>
              <Link href={`/stations/${station.id}`}>{station.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
