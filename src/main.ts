import "reflect-metadata";
import { SESSION_SECRET } from "./Configs/env";
import mainRoute from "./Routes/main";
import express from "express";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    //use a reddis store to store session cookies
    secret: SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 10 * 60 * 1000, // 10 minutes,
      httpOnly: true,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

// Add a basic root route
app.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

// Mount all routes
app.use("/api", mainRoute);
