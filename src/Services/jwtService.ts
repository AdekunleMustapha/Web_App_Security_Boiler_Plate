import jwt, { JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";
import { Service } from "typedi";
import { JWT_SECRET, JWT_TOKEN_EXPIRATION } from "../Configs/env";
import { IUser } from "../Models/user";

@Service()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: StringValue;

  constructor() {
    ((this.secret = JWT_SECRET),
      (this.expiresIn = JWT_TOKEN_EXPIRATION as StringValue));
  }

  public generateToken = (payload: IUser) => {
    return jwt.sign({ email: payload.email, role: payload.role }, this.secret, {
      expiresIn: this.expiresIn,
      algorithm: "HS256",
      subject: payload.id,
    });
  };

  public extractPayload = (token: string): JwtPayload | string => {
    return jwt.verify(token, this.secret);
  };

  public extractSubjectPayload = (token: string): string => {
    const decoded: JwtPayload | string = this.extractPayload(token);

    if (typeof decoded === "string" || !decoded.sub) {
      throw new Error("Invalid token payload: no subject found");
    }

    return decoded.sub;
  };
}
