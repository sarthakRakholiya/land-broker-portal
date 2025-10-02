import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Test database connection first
    try {
      await prisma.$connect();
    } catch (dbError) {
      // Check if it's a connection URL issue
      const errorMessage =
        dbError instanceof Error ? dbError.message : "Unknown error";
      if (
        errorMessage.includes("5432") ||
        errorMessage.includes("Can't reach database server")
      ) {
        return NextResponse.json(
          {
            error:
              "Database configuration error. Please check DATABASE_URL uses connection pooling (port 6543, not 5432).",
            details:
              "Use Supabase Connection Pooling URL, not Direct Connection URL",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user data (without password) and token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}
