import { httpServer } from "./app.js";
import logger from "./utils/logger.js";
import sequelize, { umzugSeeding } from "./config/db.js";

const PORT = process.env.PORT || 8000;

try {
  await sequelize.authenticate();
  // await sequelize.sync({ alter: true });
  await umzugSeeding.up();
  logger.info("Successfully connected to the database");
  httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });

  // Start cron jobs
  // scheduleCron();
} catch (err) {
  logger.error("Error connecting to the database: " + err.message);
  process.exit(1);
}
