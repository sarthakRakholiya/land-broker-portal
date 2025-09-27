import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@dbvekariya.com" },
    update: {},
    create: {
      email: "admin@dbvekariya.com",
      password: hashedPassword,
      name: "DB Vekariya Admin",
      role: "ADMIN",
    },
  });

  // Create a broker user
  const brokerPassword = await bcrypt.hash("broker123", 12);

  const brokerUser = await prisma.user.upsert({
    where: { email: "broker@dbvekariya.com" },
    update: {},
    create: {
      email: "broker@dbvekariya.com",
      password: brokerPassword,
      name: "Land Broker",
      role: "BROKER",
    },
  });

  // Create default locations
  const locations = ["Gondal", "Rajkot"];

  const createdLocations = [];
  for (const locationName of locations) {
    const location = await prisma.location.upsert({
      where: { name: locationName },
      update: {},
      create: { name: locationName },
    });
    createdLocations.push(location);
  }

  console.log("✅ Locations created:", createdLocations.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
