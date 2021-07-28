import {useState, useEffect, useMemo} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import {useQuery, gql} from '@apollo/client';
import {NexusGenFieldTypes} from '../graphql/nexus';
import Link from 'next/link';

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
  const {loading, error, data} = useQuery<Query>(GET_STATION_LIST);
  return (
    <div>
      <h3>Stations</h3>
      {data && (
        <ul>
          {data.stations.map((station) => (
            <li key={station.id}>
              <Link href={`/stations/${station.id}`}>{station.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
