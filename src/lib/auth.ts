import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  "db-vekariya-default-jwt-secret-change-in-production-2024";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  console.log("=== JWT Generation Debug ===");
  console.log("Generating token for payload:", payload);
  console.log("JWT_SECRET configured:", !!JWT_SECRET);

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  console.log(
    "Token generated successfully (first 50 chars):",
    token.substring(0, 50) + "..."
  );

  return token;
}

export function verifyToken(
  token: string
): { userId: string; email: string; role: string } | null {
  try {
    console.log("=== JWT Verification Debug ===");
    console.log(
      "Token to verify (first 50 chars):",
      token.substring(0, 50) + "..."
    );
    console.log(
      "JWT_SECRET configured:",
      JWT_SECRET !== "your-secret-key-here" && !!JWT_SECRET
    );

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      console.error("Current JWT_SECRET:", JWT_SECRET);
      return null;
    }

    console.log("Attempting to verify token with JWT secret...");
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    console.log("Token decoded successfully:", {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    // Validate required fields
    if (!decoded.userId || !decoded.email || !decoded.role) {
      console.error(
        "Invalid token payload - missing required fields:",
        decoded
      );
      return null;
    }

    console.log("Token verification successful");
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT Error:", error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expired:", error.message);
    } else if (error instanceof jwt.NotBeforeError) {
      console.error("Token not active:", error.message);
    }

    return null;
  }
}
