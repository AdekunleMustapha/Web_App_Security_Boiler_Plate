import "reflect-metadata";
import { Router } from "express";
import { Container } from "typedi";
import { AuthController } from "../Controllers/authController";

const authRouter = Router();
const authController = Container.get(AuthController);

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.get("/logout", authController.logout);

export default authRouter;
