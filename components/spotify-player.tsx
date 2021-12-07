import {useState, useEffect} from 'react';
import useSpotifyApis from '../hooks/use-spotify-apis';
import Image from 'next/image';

export default function SpotifyPlayer() {
  const [position, setPosition] = useState(0);
  const [playbackState, setPlaybackState] =
    useState<Spotify.PlaybackState | null>(null);
  const {playbackApi, customWebApi} = useSpotifyApis();

  // playbackApi.
  useEffect(() => {
    const onStateChanged = (state: Spotify.PlaybackState) => {
      // console.log(1111, state);
      // console.log('player_state_changed', state);
      setPlaybackState(state);
      if (state) setPosition(Math.round(state.position / 1000));
    };
    playbackApi?.addListener('player_state_changed', onStateChanged);
    return () => {
      playbackApi?.removeListener('player_state_changed', onStateChanged);
    };
  }, [playbackApi]);

  useEffect(() => {
    const id = setInterval(() => {
      // console.log(1111, playbackState?.paused);
      if (playbackState && !playbackState.paused) {
        setPosition((prev) => {
          return prev + 1;
        });
      }
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [playbackState]);

  return (
    <div>
      <h2>Spotify Player</h2>
      {customWebApi && playbackApi ? (
        playbackState ? (
          <>
            <ul>
              <li>
                Track Name: {playbackState.track_window.current_track.name}
              </li>
              <li>
                Artist Name:{' '}
                {playbackState.track_window.current_track.artists[0].name}
              </li>
              <li>Position: {position}</li>
              <li>Duration: {Math.round(playbackState.duration / 1000)}</li>
              <li>
                Album Art:
                <br />
                <Image
                  src={
                    playbackState.track_window.current_track.album.images[0].url
                  }
                  alt={playbackState.track_window.current_track.album.name}
                  width={200}
                  height={200}
                />
              </li>
            </ul>
            <div>
              <button
                onClick={() => {
                  customWebApi.pause();
                }}
                disabled={playbackState.paused}
              >
                Stop Playing
              </button>
            </div>
          </>
        ) : (
          <p>No track is currently being played.</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
