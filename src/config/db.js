/**
 * Database Configuration File with Auto-Creation
 */

import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import mysql from "mysql2/promise";

// Environment variables
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;

// Step 1: Ensure database exists
async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.end();
}

// Step 2: Create Sequelize instance
await ensureDatabaseExists();

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: NODE_ENV === "production" ? false : console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Step 3: Configure Umzug for seeding
export const umzugSeeding = new Umzug({
  migrations: { glob: "src/seeders/*.{js,cjs}" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export default sequelize;
