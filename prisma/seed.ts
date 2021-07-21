import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const comeback = await prisma.artist.create({
    data: {
      name: 'Comeback Kid',
      url: 'https://comeback-kid.com/',
      albums: {
        create: [
          {name: 'Turn It Around', year: '2003'},
          {name: 'Wake the Dead', year: '2005'},
        ],
      },
    },
  });
  console.log({comeback});
  const testStation = await prisma.station.create({
    data: {
      name: "Radio ABC",
    }
  });
  console.log({testStation});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
