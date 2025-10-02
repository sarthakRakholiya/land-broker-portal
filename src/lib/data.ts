import { prisma } from "./prisma";

export interface Location {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandRecord {
  id: string;
  fullName: string;
  mobileNo: string;
  location: {
    id: string;
    name: string;
  };
  landArea: number;
  landAreaUnit: "sqft" | "acres" | "bigha" | "hectare";
  type:
    | "land"
    | "house"
    | "apartment"
    | "commercial"
    | "industrial"
    | "agricultural";
  totalPrice: number;
  pricePerArea: number;
  createdAt: Date;
  updatedAt: Date;
}

// Server-side function to fetch locations
export async function getLocations(search?: string): Promise<Location[]> {
  try {
    await prisma.$connect();

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

    return locations.map((location) => ({
      ...location,
      createdAt: location.createdAt.toISOString(),
      updatedAt: location.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  } finally {
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}

// Server-side function to fetch lands with pagination
export async function getLands(params: {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  type?: string;
  userId?: string;
}) {
  try {
    await prisma.$connect();

    const {
      page = 0,
      limit = 10,
      search = "",
      location = "",
      type = "",
      userId,
    } = params;

    const skip = page * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (userId) {
      where.userId = userId;
    }

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

    return {
      lands: lands.map((land) => ({
        ...land,
        landAreaUnit: land.landAreaUnit.toLowerCase() as
          | "sqft"
          | "acres"
          | "bigha"
          | "hectare",
        type: land.type.toLowerCase() as
          | "land"
          | "house"
          | "apartment"
          | "commercial"
          | "industrial"
          | "agricultural",
        createdAt: land.createdAt,
        updatedAt: land.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching lands:", error);
    return {
      lands: [],
      pagination: {
        page: 0,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  } finally {
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}

// Server-side function to create a location
export async function createLocation(name: string): Promise<Location | null> {
  try {
    await prisma.$connect();

    const location = await prisma.location.create({
      data: {
        name: name.trim(),
      },
    });

    return {
      ...location,
      createdAt: location.createdAt.toISOString(),
      updatedAt: location.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error creating location:", error);
    return null;
  } finally {
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}
