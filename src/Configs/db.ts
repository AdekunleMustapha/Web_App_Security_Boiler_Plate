import "reflect-metadata";
import mongoose from "mongoose";
import { MONGODB_URI } from "./env";
import { LoggerService } from "./winston.logger";
import { Container } from "typedi";

export const goLive = async () => {
  const logger = Container.get(LoggerService);
  try {
    await mongoose.connect(MONGODB_URI!);
    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error(`Error connecting to the database: ${error}`);
  }
};
