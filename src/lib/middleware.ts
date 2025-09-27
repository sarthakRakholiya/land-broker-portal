import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function getAuthUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  return verifyToken(token);
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
