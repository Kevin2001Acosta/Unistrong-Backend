import * as dotenv from "dotenv";
dotenv.config();
const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3001,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
};
export default config;
