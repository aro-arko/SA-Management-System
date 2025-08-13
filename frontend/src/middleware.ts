import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/AuthService";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    role?:
      | "coordinator"
      | "head"
      | "lmuAdmin"
      | "lmuDataLeader"
      | "lmuMember"
      | "emuAdmin"
      | "emuMember"
      | "dsmmAdmin"
      | "hrFinanceAdmin";
  }
}

const authRoutes = ["/login", "/register"];

const roleBasedPrivateRoutes = {
  coordinator: [/^\/coordinator(?:\/.*)?$/, /^\/change-password$/],
  head: [/^\/head(?:\/.*)?$/, /^\/change-password$/],
  lmuAdmin: [/^\/lmuadmin(?:\/.*)?$/, /^\/change-password$/],
  lmuDataLeader: [/^\/lmudataleader(?:\/.*)?$/, /^\/change-password$/],
  lmuMember: [/^\/lmumember(?:\/.*)?$/, /^\/change-password$/],
  emuAdmin: [/^\/emuadmin(?:\/.*)?$/, /^\/change-password$/],
  emuMember: [/^\/emumember(?:\/.*)?$/, /^\/change-password$/],
  dsmmAdmin: [/^\/dsmmadmin(?:\/.*)?$/, /^\/change-password$/],
  hrFinanceAdmin: [/^\/hrfinanceadmin(?:\/.*)?$/, /^\/change-password$/],
} as const;

type Role = keyof typeof roleBasedPrivateRoutes;

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // let public auth routes pass if not logged in
  if (authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

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

    // lmuadmin space
    "/lmuadmin",
    "/lmuadmin/:page*",

    // lmudataleader
    "/lmudataleader",
    "/lmudataleader/:page*",

    // lmumember
    "/lmumember",
    "/lmumember/:page*",

    // emuadmin
    "/emuadmin",
    "/emuadmin/:page*",

    // emumember
    "/emumember",
    "/emumember/:page*",

    // dsmmadmin
    "/dsmmadmin",
    "/dsmmadmin/:page*",

    // hrFinanceAdmin
    "/hrfinanceadmin",
    "/hrfinanceadmin/:page*",
  ],
};
