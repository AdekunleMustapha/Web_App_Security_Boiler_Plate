import "reflect-metadata";
import { Request, Response, NextFunction, Router } from "express";
import passport from "passport";
import { Container } from "typedi";
import "./strategies/passportConfig";
import { LoggerService } from "../Configs/winston.logger";

const oauthRoute = Router();

oauthRoute.get("/google", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
});

oauthRoute.get(
  "/google/callback",
  passport.authenticate("google"),
  (req: Request, res: Response) => {
    const logger = Container.get(LoggerService);
    if (req.user) {
      logger.info(`User authenticated successfully: ${req.user}`);
      res.status(200).json({
        message: "User authenticated successfully",
        user: req.user,
      });
    } else {
      logger.error("User authentication failed");
      res.status(401).json({
        message: "User authentication failed",
      });
    }
  },
);

export default oauthRoute;
