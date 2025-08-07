import { Request, Response } from "express";
import { Service, Inject } from "typedi";
import { verifyPassword } from "../Utils/bcrypt";
import { CustomResponse } from "../Utils/CustomResponses/customResponse";
import { User } from "../Models/user";
import { LoggerService } from "../Configs/winston.logger";

// AuthController checks for only password and email, customize for more additions

@Service()
export class AuthController {
  constructor(@Inject() private logger: LoggerService) {}

  public signup = async (req: Request, res: Response): Promise<any> => {
    const customResponse = new CustomResponse(res);

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        this.logger.warn("Email and password are required for signup");
        return customResponse.badRequest(
          400,
          "Email and password are required",
        );
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        this.logger.warn(`User already exists with email: ${email}`);
        return customResponse.badRequest(
          400,
          "User already exists with this email",
        );
      } else {
        const newUser = new User({
          email,
          password,
        });

        await newUser.save();
        customResponse.setCookie(newUser);
        this.logger.info(`New user created: ${newUser.email}`);
        return customResponse.success(201, "User created successfully", {
          email: newUser.email,
        });
      }
    } catch (error) {
      this.logger.error(`Error encountered in signing user: ${error}`);
      if (error)
        return customResponse.internalServerError(500, "Internal server error");
    }
  };

  public login = async (req: Request, res: Response): Promise<any> => {
    const customResponse = new CustomResponse(res);
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        this.logger.warn("Email and password are required for login");
        return customResponse.badRequest(
          400,
          "Email and password are required",
        );
      }

      const user = await User.findOne({ email });

      if (!user) {
        this.logger.warn(`No user found with email: ${email}`);
        return customResponse.unauthorized(
          401,
          `No user found with email: ${email}`,
        );
      }

      const isPasswordValid = await verifyPassword(password, user.password!);

      if (!isPasswordValid) {
        this.logger.warn("Invalid password provided");
        return customResponse.unauthorized(401, "Invalid password");
      }

      customResponse.setCookie(user);
      this.logger.info(`User logged in successfully: ${user.email}`);
      return customResponse.success(200, "Login successful", {
        email: user.email,
      });
    } catch (error) {
      this.logger.error(`Error occurred in logging in: ${error}`);
      return customResponse.internalServerError(500, "Internal server error");
    }
  };

  public logout = async (req: Request, res: Response): Promise<any> => {
    const customResponse = new CustomResponse(res);
    req.logout((err) => {
      if (err) {
        this.logger.error(`Error during logout: ${err}`);
        return customResponse.internalServerError(500, "Logout failed");
      }
      res.clearCookie("jwt");
      this.logger.info("User logged out successfully");
      return customResponse.success(200, "Logout successful");
    });
  };
}
