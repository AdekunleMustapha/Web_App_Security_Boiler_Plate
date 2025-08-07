import "reflect-metadata";
import { LoggerService } from "./Configs/winston.logger";
import { Container } from "typedi";
import { goLive } from "./Configs/db";
import { app } from "./main";
import { PORT } from "./Configs/env";

const startSever = async () => {
  const logger = Container.get(LoggerService);
  await goLive();
  app.listen(PORT, () =>
    logger.info(`Server is running on port http://localhost:${PORT}`),
  );
};

startSever();
