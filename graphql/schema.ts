import {
  makeSchema,
  nullable,
  objectType,
  queryType,
  extendType,
  list,
} from 'nexus';
import {join} from 'path';
import {add, differenceInSeconds, max} from 'date-fns';
import {Station as StationModel} from '.prisma/client';
import {Context} from './context';
import {DateTime} from './types/DateTime';

const Query = queryType({
  definition(t) {
    t.field('stations', {
      type: list('Station'),
      args: {
        id: nullable('ID'),
      },
      resolve(_root, args, ctx) {
        if (args.id) {
          return ctx.prisma.station.findMany({where: {id: parseInt(args.id)}});
        } else {
          return ctx.prisma.station.findMany();
        }
      },
    });

    t.field('tracks', {
      type: list('Track'),
      args: {
        stationId: 'ID',
        from: 'String',
        to: nullable('String'),
      },
      resolve(_root, args, ctx) {
        const fromDate = new Date(args.from);
        let whereClause;
        if (args.to) {
          const toDate = new Date(args.to);
          whereClause = {
            stationId: parseInt(args.stationId),
            endAt: {gte: fromDate},
            playAt: {lte: toDate},
          };
        } else {
          whereClause = {
            stationId: parseInt(args.stationId),
            endAt: {gte: fromDate},
          };
        }
        return ctx.prisma.track.findMany({
          where: whereClause,
          orderBy: [{playAt: 'desc'}],
          take: 5,
        });
      },
    });

    t.field('playback', {
      type: nullable('Playback'),
      args: {
        stationId: 'ID',
      },
      async resolve(_root, args, ctx) {
        const now = new Date();
        const track = await ctx.prisma.track.findFirst({
          where: {
            stationId: parseInt(args.stationId),
            playAt: {lte: now},
            endAt: {gte: now},
          },
        });
        if (track) {
          return {
            track,
            timeElapsedInSeconds: differenceInSeconds(now, track.playAt),
          };
        }
        return null;
      },
    });
  },
});

const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createTrack', {
      type: 'Track',
      args: {
        stationId: 'ID',
        name: 'String',
        lengthInSeconds: 'Int',
        spotifyURI: nullable('String'),
      },
      async resolve(_root, args, ctx) {
        const station = await ctx.prisma.station.findUnique({
          where: {id: parseInt(args.stationId)},
        });
        const playAt = await calculateNewTrackPlayAt(station!, ctx);
        const endAt = add(playAt, {seconds: args.lengthInSeconds});
        return ctx.prisma.track.create({
          data: {
            stationId: parseInt(args.stationId),
            spotifyURI: args.spotifyURI,
            playAt: playAt,
            endAt: endAt,
            name: args.name,
            lengthInSeconds: args.lengthInSeconds,
          },
        });
      },
    });

    t.nonNull.field('createStation', {
      type: 'Station',
      args: {
        name: 'String',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.station.create({
          data: {
            name: args.name,
          },
        });
      },
    });
  },
});

async function calculateNewTrackPlayAt(station: StationModel, ctx: Context) {
  const now = new Date();
  const lastTrack = await ctx.prisma.track.findFirst({
    where: {stationId: station.id},
    orderBy: {playAt: 'desc'},
  });
  if (lastTrack === null) {
    return now;
  }
  const lastTrackEndsAt = new Date(lastTrack.playAt);
  // Add one second to add a little buffer between tracks.
  // We don't want to chop off the last moment of one song to start the next one
  lastTrackEndsAt.setSeconds(
    lastTrackEndsAt.getSeconds() + lastTrack.lengthInSeconds + 1,
  );
  return max([lastTrackEndsAt, now]);
}

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
    t.nullable.string('spotifyURI');
    t.datetime('playAt');
    t.nullable.datetime('endAt');
    t.string('name');
    t.int('lengthInSeconds');
  },
});

const Playback = objectType({
  name: 'Playback',
  definition(t) {
    t.field('timeElapsedInSeconds', {
      type: 'Int',
    });
    t.field('track', {
      type: 'Track',
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, Station, StationMeta, Track, Playback, DateTime],
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
