import {useState, useEffect, useMemo} from 'react';
import styles from './search-box.module.css';
import SpotifyWebApi from 'spotify-web-api-js';
import {useMutation, gql} from '@apollo/client';

type Track = {
  name: string;
  artistName: string;
  albumName: string;
  albumImageSrc?: string;
  albumImageHeight?: number;
  albumImageWidth?: number;
  lengthInSeconds: number;
  spotifyURI: string;
};

export default function SearchBox({
  spotifyToken,
  stationId,
}: {
  spotifyToken: string;
  stationId: number;
}) {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [tracks, setTracks] = useState([] as Track[]);

  const spotifyApi = useMemo(() => new SpotifyWebApi(), []);

  useEffect(() => {
    spotifyApi.setAccessToken(spotifyToken);
  }, []);

  useEffect(() => {
    if (searchText.length > 2 && !isSearching) {
      const search = async () => {
        const result = await spotifyApi.searchTracks(searchText, {limit: 5});
        setTracks(
          result.tracks.items.map((item) => {
            const image = item.album.images[item.album.images.length - 1];
            const artist = item.artists[0];
            return {
              name: item.name,
              artistName: artist.name,
              lengthInSeconds: Math.round(item.duration_ms / 1000),
              spotifyURI: item.uri,
              albumImageSrc: image.url,
              albumImageHeight: image.height,
              albumImageWidth: image.width,
              albumName: item.album.name,
            };
          }),
        );
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
            <li className={styles.pullDownListItem}>
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

const TrackCard = ({
  track: {
    name,
    artistName,
    albumName,
    albumImageSrc,
    albumImageHeight,
    albumImageWidth,
    lengthInSeconds,
    spotifyURI,
  },
  stationId,
}: {
  track: Track;
  stationId: number;
}) => {
  const [active, setActive] = useState(false);
  const [appendTrack, {loading, error}] = useMutation(Append_Track_To_Playlist);

  console.log(loading, error);
  return (
    <div
      className={styles.trackCard}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {loading && <div className={styles.loadingMessage}>Adding...</div>}
      <span className={styles.trackCardTextContainer}>
        <span className={styles.trackCardName}>{name}</span>
        <span className={styles.trackCardArtistName}>{artistName}</span>
      </span>
      <img
        className={styles.trackCardAlbumImage}
        alt={albumName}
        src={albumImageSrc}
      />
      {active && (
        <a
          className={styles.trackCardAddButton}
          onClick={() =>
            appendTrack({
              variables: {
                stationId,
                name,
                lengthInSeconds,
                spotifyURI,
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
