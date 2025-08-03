import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/AuthService";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    role?: string;
  }
}

const authRoutes = ["/login", "/register"];
const roleBasedPrivateRoutes = {
  coordinator: [
    /^\/coordinator/,
    /^\/coordinator-profile/,
    /^\/change-password/,
  ],
};
type Role = keyof typeof roleBasedPrivateRoutes;

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  // Define a type for the user info that includes 'role'
  type UserInfo = {
    role?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };

  const userInfo = (await getCurrentUser()) as UserInfo | null;
  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          `http://localhost:3000/login?redirectPath=${pathname}`,
          request.url
        )
      );
    }
  }

  if (userInfo.role && roleBasedPrivateRoutes[userInfo.role as Role]) {
    const routes = roleBasedPrivateRoutes[userInfo.role as Role];
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }
  return NextResponse.redirect(new URL("/", request.url));
};

export const config = {
  matcher: ["/login", "/coordinator", "/coordinator/:page"],
};
