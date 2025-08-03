// types/jwt.d.ts
import "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    role?: string;
    email?: string;
  }
}
