import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/AuthService";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    role?: "coordinator" | "head";
  }
}

const authRoutes = ["/login", "/register"];

const roleBasedPrivateRoutes = {
  coordinator: [
    /^\/coordinator(?:\/.*)?$/,
    /^\/coordinator-profile(?:\/.*)?$/,
    /^\/change-password$/,
  ],
  head: [
    /^\/head(?:\/.*)?$/,
    /^\/head-profile(?:\/.*)?$/,
    /^\/change-password$/,
  ],
} as const;

type Role = keyof typeof roleBasedPrivateRoutes;

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // let public auth routes pass if not logged in
  if (authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // NOTE: if getCurrentUser() uses `cookies()` from next/headers, it may not work in middleware.
  // Prefer reading the cookie from the request in middleware if you hit issues:
  // const token = request.cookies.get("accessToken")?.value;
  const userInfo = (await getCurrentUser()) as { role?: Role } | null;

  if (!userInfo?.role) {
    return NextResponse.redirect(
      new URL(
        `/login?redirectPath=${encodeURIComponent(pathname)}`,
        request.url
      )
    );
  }

  const routes = roleBasedPrivateRoutes[userInfo.role];
  if (routes?.some((re) => re.test(pathname))) {
    return NextResponse.next();
  }

  // fallback
  return NextResponse.redirect(new URL("/", request.url));
};

export const config = {
  matcher: [
    "/login",
    "/register",
    "/change-password",

    // coordinator space
    "/coordinator",
    "/coordinator/:page*",

    // head space
    "/head",
    "/head/:page*",

    // optional separate profile routes
    "/coordinator-profile",
    "/head-profile",
  ],
};
