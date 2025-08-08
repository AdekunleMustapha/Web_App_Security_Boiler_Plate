import "reflect-metadata";
import { Response } from "express";
import { JwtService } from "../../Services/jwtService";
import { Container } from "typedi";
import { IUser } from "../../Models/user";
import { COOKIE_MAX_AGE, ENV } from "../../Configs/env";

export class CustomResponse {
  private jwtService: JwtService;

  constructor(private res: Response) {
    this.jwtService = Container.get(JwtService);
  }

  private baseResponse(statusCode: number, message: string, data?: any) {
    return this.res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  public success(
    statusCode: number = 200,
    message: string = "Response successful",
    data?: any,
  ) {
    return this.baseResponse(statusCode, message, data);
  }

  public unauthorized(
    statusCode: number = 401,
    message: string = "Unauthorized",
    data?: any,
  ) {
    return this.baseResponse(statusCode, message, data);
  }

  public badRequest(
    statusCode: number = 400,
    message: string = "Invalid Credentials",
    data?: any,
  ) {
    return this.baseResponse(statusCode, message, data);
  }

  public notFound(
    statusCode: number = 404,
    message: string = "Page not found",
    data?: any,
  ) {
    return this.baseResponse(statusCode, message, data);
  }

  public internalServerError(
    statusCode: number = 500,
    message: string = "Server Error",
    data?: any,
  ) {
    return this.baseResponse(statusCode, message, data);
  }

  public unauthorizedRedirect(statusCode: number = 401, path: string = "") {
    return this.res.status(statusCode).redirect(path);
  }

  public setCookie(payload: IUser) {
    const token = this.jwtService.generateToken(payload);
    this.res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE,
      secure: ENV === 'production',
      sameSite: 'strict'
    });
  }
}
