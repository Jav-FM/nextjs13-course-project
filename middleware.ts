import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest, res: NextResponse) {
  const bearerToken = req.headers.get("authorization") as string;

  const unauthorizedError = new NextResponse(
    JSON.stringify({ errorMessage: "Unauthorized request" }),
    { status: 401 }
  );

  if (!bearerToken) {
    return unauthorizedError;
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return unauthorizedError;
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    if (!token) {
      return unauthorizedError;
    }
  }
}

export const config = {
  matcher: ["/api/auth/me"],
};
