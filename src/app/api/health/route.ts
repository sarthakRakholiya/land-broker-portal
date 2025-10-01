import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("=== Health Check Debug ===");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("DATABASE_URL configured:", !!process.env.DATABASE_URL);
    console.log("NEXTAUTH_SECRET configured:", !!process.env.NEXTAUTH_SECRET);
    console.log("JWT_SECRET configured:", !!process.env.JWT_SECRET);

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

    if (!hasJwtSecret) {
      console.warn("JWT secret not configured, using default");
    }

    // Check database connection
    console.log("Testing database connection...");
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection successful");

    // Test a simple query
    const locationCount = await prisma.location.count();
    console.log("Location count:", locationCount);

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
    console.error("Health check failed:", error);

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
