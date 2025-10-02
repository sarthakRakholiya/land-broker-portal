import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check environment variables
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasJwtSecret = !!(
      process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
    );
    const dbUrlPreview = process.env.DATABASE_URL
      ? process.env.DATABASE_URL.substring(0, 20) + "..."
      : "Not set";

    if (!hasDbUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    // Check database connection
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    // Test a simple query
    const locationCount = await prisma.location.count();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      locationCount,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl,
        hasJwtSecret,
        dbUrlPreview,
        platform: process.env.VERCEL ? "Vercel" : "Local",
      },
    });
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    };

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: errorDetails,
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
          hasJwtSecret: !!(
            process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
          ),
          dbUrlPreview: process.env.DATABASE_URL
            ? process.env.DATABASE_URL.substring(0, 20) + "..."
            : "Not set",
          platform: process.env.VERCEL ? "Vercel" : "Local",
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
