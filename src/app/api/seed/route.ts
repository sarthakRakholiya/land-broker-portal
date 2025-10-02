import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Check if we're in production and require a secret key
    const { secret } = await request.json();

    if (
      process.env.NODE_ENV === "production" &&
      secret !== "seed-db-vekariya-2024"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test database connection
    await prisma.$connect();

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

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        adminUser: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        },
        locationsCount: createdLocations.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Seeding failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}
