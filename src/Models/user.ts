import "reflect-metadata";
import mongoose from "mongoose";
import { generateHashPassword } from "../Utils/bcrypt";
import { LoggerService } from "../Configs/winston.logger";
import { Container } from "typedi";
import { isEmail } from "validator";

enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser extends mongoose.Document {
  email: string;
  googleId?: string;
  password?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "This email has been used already"],
      lowercase: true,
      validate: [isEmail, "Please provide a valid email address"],
    },
    googleId: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.post(
  "save",
  (error: any, _doc: IUser, next: (err?: Error) => void) => {
    const logger = Container.get(LoggerService);

    if (error.name === "MongoServerError" && error.code === 11000) {
      // Handle duplicate key error
      const key = Object.keys(error.keyValue)[0];
      const message = `${key} '${error.keyValue[key]}' already exists`;
      logger.warn(`Duplicate key error : ${message}`);
      next(new Error(message));
    } else if (error.name === "ValidationError") {
      // Handle validation errors
      const messages = Object.values(error.errors).map(
        (err: any) => err.message,
      );
      logger.error(`Validation error: ${messages.join(", ")}`);
      next(new Error(messages.join(", ")));
    } else {
      // Handle other errors
      logger.error(`Database error: ${error.message}`);
      next(error);
    }
  },
);

userSchema.pre("save", async function (next) {
  const logger = Container.get(LoggerService);
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password if exists
    if (this.password) {
      this.password = await generateHashPassword(this.password);
    }
    next();
  } catch (error) {
    logger.error(`Error occurred in presave of model: ${error}`);
    next(error as Error);
  }
});

export const User = mongoose.model<IUser>("User", userSchema);
