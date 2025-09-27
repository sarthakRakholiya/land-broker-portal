import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/locations - Get all locations
export async function GET(request: NextRequest) {
  try {
    console.log("Prisma client:", prisma);
    console.log("Location model:", prisma?.location);

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
    console.error("Get locations error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch locations";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/locations - Create a new location
export async function POST(request: NextRequest) {
  try {
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
    console.error("Create location error:", error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Location with this name already exists" },
        { status: 409 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to create location";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
