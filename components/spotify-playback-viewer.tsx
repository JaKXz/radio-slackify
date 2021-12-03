import {useState, useEffect} from 'react';
import useSpotifyApis from '../hooks/use-spotify-apis';

export default function SpotifyPlaybackViewer() {
  const [position, setPosition] = useState(0);
  const [playbackState, setPlaybackState] =
    useState<Spotify.PlaybackState | null>(null);
  const {playbackApi} = useSpotifyApis();

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
      <h2>Spotify Playback Viewer</h2>
      {playbackState ? (
        <ul>
          <li>Track Name: {playbackState.track_window.current_track.name}</li>
          <li>
            Artist Name:{' '}
            {playbackState.track_window.current_track.artists[0].name}
          </li>
          <li>Position: {position}</li>
          <li>Duration: {Math.round(playbackState.duration / 1000)}</li>
          <li>
            <img
              src={playbackState.track_window.current_track.album.images[0].url}
              width={100}
            />
          </li>
          <li>Paused: {playbackState.paused ? 'Yes' : 'No'}</li>
        </ul>
      ) : (
        <p>No track is currently being played.</p>
      )}
    </div>
  );
}
