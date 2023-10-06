import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {}

export const config = {
  marcher: ["/api/aut/me"],
};
