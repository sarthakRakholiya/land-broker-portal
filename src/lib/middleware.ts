import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function getAuthUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return null;
    }

    if (!authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token || token.trim() === "") {
      return null;
    }

    const user = verifyToken(token);

    if (!user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function requireAuth(
  handler: (request: NextRequest, ...args: unknown[]) => Promise<Response>
) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const user = getAuthUser(request);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Add user to request object
    (request as unknown as { user: { userId: string; email: string } }).user =
      user;

    return handler(request, ...args);
  };
}
