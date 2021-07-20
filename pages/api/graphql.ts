import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../graphql-schema";
import { context } from "../../graphql-context";
import {NextApiRequest, NextApiResponse} from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const server = new ApolloServer({ schema, context });
  await server.start();
  const handler = server.createHandler({ path: "/api/graphql" });
  return handler(req, res);
};
