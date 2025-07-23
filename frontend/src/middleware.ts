import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/AuthService";

type Role = keyof typeof roleBasedPrivateRoutes;

const authRoutes = ["/login", "/register"];
const roleBasedPrivateRoutes = {
  tutor: [/^\/tutor/, /^\tutor-profile/, /^\/change-password/],
  student: [
    /^\/student/,
    /^\/booking/,
    /^\student-profile/,
    /^\/change-password/,
    /^\/wishlist/,
  ],
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const userInfo = await getCurrentUser();
  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          `https://tutorlink-frontend-mu.vercel.app/login?redirectPath=${pathname}`,
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
  matcher: [
    "/login",
    "/tutor",
    "/tutor/:page",
    "/student",
    "/student/:page",
    "/booking",
    "/booking/:page",
    "/tutor-profile",
    "/student-profile",
    "/change-password",
    "/wishlist",
  ],
};
