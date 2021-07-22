import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const testStation = await prisma.station.create({
    data: {
      name: 'Radio ABC',
    },
  });
  console.log({testStation});
  const track1 = await prisma.track.create({
    data: {
      playAt: new Date(),
      spotifyURI: 'spotify:track:11dFghVXANMlKmJXsNCbNl',
      stationId: testStation.id,
      name: 'Another One Bites the Dust',
      lengthInSeconds: 300,
    },
  });
  console.log({track1});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
