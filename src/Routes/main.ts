import { Router } from "express";
import oauthRoute from "./oauth";
import authRoute from "./authRoute";

const mainRoute = Router();
mainRoute.use("/auth", oauthRoute);
mainRoute.use("/auth", authRoute);

export default mainRoute;
