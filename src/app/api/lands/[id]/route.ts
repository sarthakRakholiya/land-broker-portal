import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      console.log("Unauthorized access attempt to land details");
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required. Please login again.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const land = await prisma.land.findFirst({
      where: {
        id,
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

    if (!land) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }

    return NextResponse.json(land);
  } catch (error) {
    console.error("Get land error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch land record";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      console.log("Unauthorized access attempt to land details");
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required. Please login again.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    // Check if land exists and belongs to user
    const existingLand = await prisma.land.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!existingLand) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }

    const pricePerArea = totalPrice / landArea;

    const land = await prisma.land.update({
      where: { id },
      data: {
        fullName,
        mobileNo,
        locationId,
        landArea: parseFloat(landArea),
        landAreaUnit: landAreaUnit.toUpperCase(),
        type: type.toUpperCase(),
        totalPrice: parseFloat(totalPrice),
        pricePerArea,
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

    return NextResponse.json(land);
  } catch (error) {
    console.error("Update land error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update land record";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      console.log("Unauthorized access attempt to land details");
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required. Please login again.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if land exists and belongs to user
    const existingLand = await prisma.land.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!existingLand) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }

    await prisma.land.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Land deleted successfully" });
  } catch (error) {
    console.error("Delete land error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete land record";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
