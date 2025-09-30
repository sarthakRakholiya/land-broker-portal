import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    // Check environment variables
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasJwtSecret = !!(
      process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
    );

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl,
        hasJwtSecret,
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
          hasJwtSecret: !!(
            process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
          ),
        },
      },
      { status: 503 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}

