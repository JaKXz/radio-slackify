const loadScript = () =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector('#spotify-player')) {
      return resolve();
    }
    const script = document.createElement('script');
    script.id = 'spotify-player';
    script.type = 'text/javascript';
    script.async = false;
    script.defer = true;
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Error loading spotify-player.js'));
    document.head.appendChild(script);
  });

const waitForReady = () =>
  new Promise<void>((resolve) => {
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve();
      };
    } else {
      resolve();
    }
  });

export default function loadSpotifyPlaybackApi() {
  return new Promise<void>(async (resolve) => {
    await Promise.all([waitForReady(), loadScript()]);
    resolve();
  });
}
