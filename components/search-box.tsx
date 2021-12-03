import {useState, useEffect} from 'react';
import styles from './search-box.module.css';
import {useMutation, gql} from '@apollo/client';
import {Track} from 'spotify-web-api-ts/types/types/SpotifyObjects';
import useSpotifyApis from '../hooks/use-spotify-apis';

export default function SearchBox({stationId}: {stationId: number}) {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setSearching] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const {webApi} = useSpotifyApis();
  const [tracks, setTracks] = useState([] as Track[]);

  useEffect(() => {
    if (searchText.length > 2 && !isSearching && webApi) {
      const search = async () => {
        const result = await webApi.search.searchTracks(searchText, {
          limit: 5,
        });
        setTracks(result.items);
        setSearching(false);
      };
      setSearching(true);
      search();
    } else if (searchText.length <= 2) {
      setTracks([]);
    }
  }, [searchText, webApi]);

  useEffect(() => {
    const handler = (e: MouseEvent) => setVisible(false);
    if (isVisible) {
      window.addEventListener('click', handler);
    } else {
      window.removeEventListener('click', handler);
    }
    return () => window.removeEventListener('click', handler);
  }, [isVisible]);

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <input
        className={styles.searchTextBox}
        onChange={(e) => setSearchText(e.currentTarget.value)}
        value={searchText}
        onFocus={() => setVisible(true)}
        // disabled={isSearching}
      />
      {isVisible && (
        <ul className={styles.pullDownList}>
          {tracks.map((track) => {
            return (
              <li className={styles.pullDownListItem} key={track.uri}>
                <TrackCard
                  track={track}
                  stationId={stationId}
                  onAppendTrack={() => setVisible(false)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const APPEND_TRACK = gql`
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

const TrackCard = ({
  track,
  stationId,
  onAppendTrack,
}: {
  track: Track;
  stationId: number;
  onAppendTrack: () => void;
}) => {
  const [active, setActive] = useState(false);
  const [appendTrack, {loading, error}] = useMutation(APPEND_TRACK);
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
        <button
          className={styles.trackCardAddButton}
          onClick={async (e) => {
            e.preventDefault();
            await appendTrack({
              variables: {
                stationId,
                name: track.name,
                lengthInSeconds: Math.round(track.duration_ms / 1000),
                spotifyURI: track.uri,
              },
            });
            onAppendTrack();
          }}
        >
          <Plus />
        </button>
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
