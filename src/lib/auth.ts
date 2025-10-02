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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(
  token: string
): { userId: string; email: string; role: string } | null {
  try {
    if (!JWT_SECRET) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Validate required fields
    if (!decoded.userId || !decoded.email || !decoded.role) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
