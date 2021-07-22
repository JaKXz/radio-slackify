import {ApolloServer} from 'apollo-server-micro';
import {schema} from '../../graphql/schema';
import {context} from '../../graphql/context';
import {NextApiRequest, NextApiResponse} from 'next';

const server = new ApolloServer({schema, context});
const startServer = server.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Headers to make us compatible with the nice graphql UI
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com',
  );
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await server.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
