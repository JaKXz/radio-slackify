import {useState, useEffect, useMemo} from 'react';
import styles from './search-box.module.css';
import SpotifyWebApi from 'spotify-web-api-js';
import {useMutation, gql} from '@apollo/client';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

type SearchTracks = PropType<
  InstanceType<typeof SpotifyWebApi>,
  'searchTracks'
>;
type TrackSerachResponse = UnPromisify<ReturnType<SearchTracks>>;
type Tracks = PropType<TrackSerachResponse, 'tracks'>;
type Track = PropType<Tracks, 'items'>[number];

export default function SearchBox({
  spotifyToken,
  stationId,
}: {
  spotifyToken: string;
  stationId: number;
}) {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const spotifyApi = useMemo(() => new SpotifyWebApi(), []);

  useEffect(() => {
    spotifyApi.setAccessToken(spotifyToken);
  }, []);

  const [tracks, setTracks] = useState([] as Track[]);

  useEffect(() => {
    if (searchText.length > 2 && !isSearching) {
      const search = async () => {
        const result = await spotifyApi.searchTracks(searchText, {limit: 5});
        setTracks(result.tracks.items);
        setIsSearching(false);
      };
      setIsSearching(true);
      search();
    } else if (searchText.length <= 2) {
      setTracks([]);
    }
  }, [searchText]);

  return (
    <div className={styles.container}>
      <input
        className={styles.searchTextBox}
        onChange={(e) => setSearchText(e.currentTarget.value)}
        value={searchText}
        // disabled={isSearching}
      />
      <ul className={styles.pullDownList}>
        {tracks.map((track) => {
          return (
            <li className={styles.pullDownListItem} key={track.uri}>
              <TrackCard track={track} stationId={stationId} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const Append_Track_To_Playlist = gql`
  mutation AppendTrackToPlaylist(
    $stationId: ID!
    $name: String!
    $lengthInSeconds: Int!
    $spotifyURI: String!
  ) {
    createTrack(
      stationId: $stationId
      name: $name
      lengthInSeconds: $lengthInSeconds
      spotifyURI: $spotifyURI
    ) {
      name
      playAt
    }
  }
`;

const TrackCard = ({track, stationId}: {track: Track; stationId: number}) => {
  const [active, setActive] = useState(false);
  const [appendTrack, {loading, error}] = useMutation(Append_Track_To_Playlist);
  const artist = track.artists[0];
  const image = track.album.images[track.album.images.length - 1];

  // console.log(loading, error);
  return (
    <div
      className={styles.trackCard}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {loading && <div className={styles.loadingMessage}>Adding...</div>}
      <span className={styles.trackCardTextContainer}>
        <span className={styles.trackCardName}>{track.name}</span>
        <span className={styles.trackCardArtistName}>{artist.name}</span>
      </span>
      <img
        className={styles.trackCardAlbumImage}
        alt={track.album.name}
        src={image.url}
      />
      {active && (
        <a
          className={styles.trackCardAddButton}
          onClick={() =>
            appendTrack({
              variables: {
                stationId,
                name: track.name,
                lengthInSeconds: Math.round(track.duration_ms / 1000),
                spotifyURI: track.uri,
              },
            })
          }
        >
          <Plus />
        </a>
      )}
    </div>
  );
};

const Plus = () => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 52 52" xmlSpace="preserve">
      <path
        d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M38.5,28H28v11c0,1.104-0.896,2-2,2
        s-2-0.896-2-2V28H13.5c-1.104,0-2-0.896-2-2s0.896-2,2-2H24V14c0-1.104,0.896-2,2-2s2,0.896,2,2v10h10.5c1.104,0,2,0.896,2,2
        S39.604,28,38.5,28z"
      />
    </svg>
  );
};
