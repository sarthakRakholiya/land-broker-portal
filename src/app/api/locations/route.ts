import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/locations - Get all locations
export async function GET(request: NextRequest) {
  try {
    // Test database connection first
    try {
      await prisma.$connect();
    } catch (dbError) {
      throw new Error(
        `Database connection failed: ${
          dbError instanceof Error ? dbError.message : "Unknown error"
        }`
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let where = {};
    if (search) {
      where = {
        name: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    const locations = await prisma.location.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(locations);
  } catch (error) {
    // Check if it's a database connection error
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch locations";

    // Return different error messages based on error type
    if (
      errorMessage.includes("connect") ||
      errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("timeout")
    ) {
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    // Ensure connection is cleaned up
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}

// POST /api/locations - Create a new location
export async function POST(request: NextRequest) {
  try {
    // Ensure Prisma is connected
    await prisma.$connect();

    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Location name is required" },
        { status: 400 }
      );
    }

    const location = await prisma.location.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Location with this name already exists" },
        { status: 409 }
      );
    }

    // Check if it's a database connection error
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create location";

    if (
      errorMessage.includes("connect") ||
      errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("timeout")
    ) {
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    // Ensure connection is cleaned up
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}
