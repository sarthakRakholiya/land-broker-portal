import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    console.log("=== Auth Verification Debug ===");

    // Log all headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    console.log("Request headers:", {
      authorization: headers.authorization,
      "content-type": headers["content-type"],
      host: headers.host,
    });

    const user = getAuthUser(request);

    if (!user) {
      console.log("Auth verification failed - no user returned");
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Token verification failed",
          debug: {
            hasAuthHeader: !!headers.authorization,
            authHeaderFormat: headers.authorization?.substring(0, 20) + "...",
          },
        },
        { status: 401 }
      );
    }

    console.log("Auth verification successful:", {
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

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
    console.error("Auth verification error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
