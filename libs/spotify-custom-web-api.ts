const spotifyWebApiFetch = async ({
  uri,
  token,
  method = 'post',
  body = null,
}: {
  uri: string;
  token: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  body?: Object | null;
}) => {
  fetch(`https://api.spotify.com/v1${uri}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export class SpotifyCustomWebApi {
  private deviceId: string;
  private token: string;

  constructor(token: string, deviceId: string) {
    this.token = token;
    this.deviceId = deviceId;
  }

  play(uri: string, position_ms = 0) {
    return spotifyWebApiFetch({
      uri: `/me/player/play?device_id=${this.deviceId}`,
      method: 'put',
      token: this.token,
      body: {
        uris: [uri],
        position_ms,
      },
    });
  }
}
