import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      console.log("Unauthorized access attempt to lands API");
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required. Please login again.",
        },
        { status: 401 }
      );
    }

    console.log("Authenticated user:", user.userId, user.email);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const type = searchParams.get("type") || "";

    const skip = page * limit;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId: user.userId,
    };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { location: { name: { contains: search, mode: "insensitive" } } },
        { mobileNo: { contains: search } },
      ];
    }

    if (location) {
      where.location = {
        name: {
          contains: location,
          mode: "insensitive",
        },
      };
    }

    if (type) {
      where.type = { equals: type.toUpperCase() };
    }

    const [lands, total] = await Promise.all([
      prisma.land.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          location: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.land.count({ where }),
    ]);

    return NextResponse.json({
      lands,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get lands error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch lands";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      console.log("Unauthorized access attempt to create land");
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required. Please login again.",
        },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      fullName,
      mobileNo,
      locationId,
      landArea,
      landAreaUnit,
      type,
      totalPrice,
    } = data;

    if (
      !fullName ||
      !mobileNo ||
      !locationId ||
      !landArea ||
      !landAreaUnit ||
      !type ||
      !totalPrice
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const pricePerArea = totalPrice / landArea;

    const land = await prisma.land.create({
      data: {
        fullName,
        mobileNo,
        locationId,
        landArea: parseFloat(landArea),
        landAreaUnit: landAreaUnit.toUpperCase(),
        type: type.toUpperCase(),
        totalPrice: parseFloat(totalPrice),
        pricePerArea,
        userId: user.userId,
      },
      include: {
        location: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(land, { status: 201 });
  } catch (error) {
    console.error("Create land error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create land record";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
