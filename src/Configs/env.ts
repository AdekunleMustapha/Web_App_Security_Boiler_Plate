import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const ENV = process.env.NODE_ENV!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const MONGODB_USERNAME = process.env.MONGODB_USERNAME!;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD!;
export const MONGODB_URI = process.env.MONGODB_URI!;
export const PORT = process.env.PORT!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_TOKEN_EXPIRATION = process.env.JWT_TOKEN_EXPIRATION!;
export const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
