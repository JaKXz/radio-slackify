import {NextApiRequest, NextApiResponse} from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res
    .status(200)
    .send([
      {
        id: 1,
        spotifyUri: 'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
        playAt: '2021-07-21T20:15:40.691Z',
      },
    ]);
}
