import "reflect-metadata";
import { JwtService } from "../Services/jwtService";
import { Request, Response, NextFunction } from "express";
import { CustomResponse } from "../Utils/CustomResponses/customResponse";
import { Container } from "typedi";
import { LoggerService } from "../Configs/winston.logger";
import { JwtPayload } from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customResponse = new CustomResponse(res);
  const logger = Container.get(LoggerService);
  const jwtService = Container.get(JwtService);

  try {
    const token = req.cookies.jwt;

    if (!token) {
      logger.warn("Client doesn't have token");
      return customResponse.unauthorizedRedirect();
    }

    const decodedToken: JwtPayload | string = jwtService.extractPayload(token);
    logger.info(`${decodedToken}`);
    next();
  } catch (error) {
    logger.warn("Invalid Token");
    return customResponse.unauthorizedRedirect();
  }
};
