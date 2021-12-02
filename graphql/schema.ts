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
import {Station as StationModel, Track as TrackModel} from '.prisma/client';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient({log: ['query', 'info']});

const Query = queryType({
  definition(t) {
    t.field('stations', {
      type: list('Station'),
      args: {
        id: nullable('ID'),
      },
      async resolve(_root, args) {
        const promise = args.id
          ? prisma.station.findMany({where: {id: parseInt(args.id)}})
          : prisma.station.findMany();
        const stationModels = await promise;
        return stationModels.map(stationModelToStation);
      },
    });

    t.field('tracks', {
      type: list('Track'),
      args: {
        stationId: 'ID',
        from: 'String',
        to: nullable('String'),
      },
      async resolve(_root, args) {
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

        const trackModels = await prisma.track.findMany({
          where: whereClause,
          orderBy: [{playAt: 'desc'}],
          take: 5,
        });

        return trackModels.map(trackModelToTrack);
      },
    });

    t.field('playback', {
      type: nullable('Playback'),
      args: {
        stationId: 'ID',
      },
      async resolve(_root, args) {
        const now = new Date();
        const track = await prisma.track.findFirst({
          where: {
            stationId: parseInt(args.stationId),
            playAt: {lte: now},
            endAt: {gte: now},
          },
        });
        if (track) {
          return {
            track: trackModelToTrack(track),
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
      async resolve(_root, args) {
        const stationId = parseInt(args.stationId);
        const playAt = await calculateNewTrackPlayAt(stationId);
        const endAt = add(playAt, {seconds: args.lengthInSeconds});
        return prisma.track
          .create({
            data: {
              stationId,
              spotifyURI: args.spotifyURI,
              playAt,
              endAt,
              name: args.name,
              lengthInSeconds: args.lengthInSeconds,
            },
          })
          .then(trackModelToTrack);
      },
    });

    t.nonNull.field('createStation', {
      type: 'Station',
      args: {
        name: 'String',
      },
      async resolve(_root, args) {
        return prisma.station
          .create({
            data: {
              name: args.name,
            },
          })
          .then(stationModelToStation);
      },
    });
  },
});

async function calculateNewTrackPlayAt(stationId: number) {
  const now = new Date();
  const lastTrack = await prisma.track.findFirst({
    where: {stationId: stationId},
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

const stationModelToStation = (stationModel: StationModel) => {
  return {
    ...stationModel,
    id: String(stationModel.id),
  };
};

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
    t.nonNull.string('name');
    t.int('lengthInSeconds');
    t.nullable.string('spotifyURI');
    t.nonNull.string('playAt');
    t.nullable.string('endAt');
  },
});

const trackModelToTrack = (trackModel: TrackModel) => {
  return {
    ...trackModel,
    id: String(trackModel.id),
    playAt: trackModel.playAt.toISOString(),
    endAt: trackModel.endAt?.toISOString(),
  };
};

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
  types: [Query, Mutation, Station, StationMeta, Track, Playback],
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  outputs: {
    schema: join(process.cwd(), 'graphql', 'schema.graphql'),
    typegen: join(process.cwd(), 'graphql', 'nexus.ts'),
  },
  // sourceTypes: {
  //   modules: [{module: '.prisma/client', alias: 'prisma'}],
  //   debug: process.env.NODE_ENV === 'development',
  // },
  contextType: {
    module: join(process.cwd(), 'graphql', 'context.ts'),
    export: 'Context',
  },
  nonNullDefaults: {
    input: true,
    output: true,
  },
});
