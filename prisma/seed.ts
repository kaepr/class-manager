import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "john@doe.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.batch.deleteMany({});

  await prisma.batch.create({
    data: {
      start_time: "6AM",
      end_time: "7AM",
    },
  });

  await prisma.batch.create({
    data: {
      start_time: "7AM",
      end_time: "8AM",
    },
  });

  await prisma.batch.create({
    data: {
      start_time: "8AM",
      end_time: "9AM",
    },
  });

  await prisma.batch.create({
    data: {
      start_time: "5PM",
      end_time: "6PM",
    },
  });

  const hashedPassword = await bcrypt.hash("johnpassword", 10);

  const user = await prisma.user.create({
    data: {
      age: 10,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
