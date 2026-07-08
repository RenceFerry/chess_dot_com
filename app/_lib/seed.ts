import prisma from "./prisma";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const NUM = 150;
const FOLLOWING_ID = '1c35ccc8-aa05-4e63-871f-5cb207355b32'

async function seed() {
  const password = await bcrypt.hash('12345678', 10);

  let follower = 0;

  const users = Array.from({ length: NUM }).map(() => {
    let follow = false;
    if (follower < NUM / 2) {
      follower++;
      follow = true;
    }

    return {
      name: faker.internet.username(),
      email: faker.internet.email(),
      password: password,
      elo: Math.floor(Math.random() * 1000) + 1000,
      image: faker.image.avatar(),
      follow
    }
  })

  const result = await Promise.all(
  users.map(user =>
    prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        elo: user.elo,
        image: user.image,
        ...(user.follow && {
          followers: {
            create: [{ followerId: FOLLOWING_ID }],
          },
        }),
      },
    })
  )
);

  console.log(`Seeded ${NUM} users, with ${follower} following the user with ID ${FOLLOWING_ID}, and ${NUM - follower} not following.`);
  console.log(`Created ${result.length} new users in the database.`);
  console.log(result);
  
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  console.log('disconnecting from database...');
  await prisma.$disconnect();
});