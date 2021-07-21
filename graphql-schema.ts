import {makeSchema, objectType, queryType} from 'nexus';
import {join} from 'path';

const Query = queryType({
  definition(t) {
    t.list.field('albums', {
      type: 'Album',
      args: {
        first: 'Int',
      },
      resolve(_root, args, ctx) {
        return ctx.prisma.album.findMany({take: args.first});
      },
    });

    t.list.field('stations', {
      type: 'Station',
      args: {
        first: 'Int',
      },
      resolve(_root, args, ctx) {
        return ctx.prisma.station.findMany({take: args.first});
      }
    });
  },
});

const Artist = objectType({
  name: 'Artist',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('url');
  },
});

const Album = objectType({
  name: 'Album',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('year');
    t.field('artist', {
      type: 'Artist',
      async resolve(album, _args, ctx) {
        const artist = await ctx.prisma.artist.findFirst({
          where: {id: album.artistId},
        });
        // The ! tells TypeScript to trust us, it won't be null
        return artist!;
      },
    });
  },
});

const Station = objectType({
  name: 'Station',
  definition(t) {
    t.int('id');
    t.string('name');
    t.field('meta', {
      type: 'StationMeta',
      async resolve(station, _args, ctx) {
        return {'name': station.name};
      }
    });
  },
});

const StationMeta = objectType({
  name: 'StationMeta',
  definition(t) {
    t.string('name');
  },
});

export const schema = makeSchema({
  types: [Query, Artist, Album, Station, StationMeta],
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  outputs: {
    schema: join(process.cwd(), 'schema.graphql'),
    typegen: join(process.cwd(), 'nexus.ts'),
  },
  sourceTypes: {
    modules: [{module: '.prisma/client', alias: 'prisma'}],
    debug: process.env.NODE_ENV === 'development',
  },
  contextType: {
    module: join(process.cwd(), "graphql-context.ts"),
    export: "Context",
  },
  nonNullDefaults: {
    input: true,
    output: true,
  },
});
