import {useState, useEffect} from 'react';
import {useQuery, gql} from '@apollo/client';
import {NexusGenFieldTypes} from '../graphql/nexus';
import Link from 'next/link';
import {Station} from '@prisma/client';

type Query = NexusGenFieldTypes['Query'];

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
  const {loading, error, data} = useQuery<Query>(GET_STATION_LIST, {
    // pollInterval: 5000
  });
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
