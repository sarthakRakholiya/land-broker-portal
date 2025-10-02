import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Token verification failed",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
      message: "Token is valid",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
