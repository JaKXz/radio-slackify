import {list, makeSchema, nullable, objectType, queryType} from 'nexus';
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
        id: nullable('ID'),
      },
      resolve(_root, args, ctx) {
        if( args.id ) {
          return ctx.prisma.station.findMany({where: {id: parseInt(args.id)}});
        } else {
          return ctx.prisma.station.findMany();
        }
      }
    });

    t.list.field('tracks', {
      type: 'Track',
      args: {
        stationId: 'ID',
      },
      resolve(_root, args, ctx) {
        return ctx.prisma.track.findMany({where: {stationId: parseInt(args.stationId)}});
      }
    })
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
    t.id('id');
    t.string('name');
    t.field('meta', {
      type: 'StationMeta',
      async resolve(station, _args, ctx) {
        return {name: station.name};
      },
    });
  },
});

const StationMeta = objectType({
  name: 'StationMeta',
  definition(t) {
    t.string('name');
  },
});

const Track = objectType({
  name: 'Track',
  definition(t) {
    t.id('id');
    t.string('spotifyURI');
    t.string('appleMusicURI');
  }
})

export const schema = makeSchema({
  types: [Query, Artist, Album, Station, StationMeta, Track],
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  outputs: {
    schema: join(process.cwd(), 'graphql', 'schema.graphql'),
    typegen: join(process.cwd(), 'graphql', 'nexus.ts'),
  },
  sourceTypes: {
    modules: [{module: '.prisma/client', alias: 'prisma'}],
    debug: process.env.NODE_ENV === 'development',
  },
  contextType: {
    module: join(process.cwd(), 'graphql', 'context.ts'),
    export: 'Context',
  },
  nonNullDefaults: {
    input: true,
    output: true,
  },
});
