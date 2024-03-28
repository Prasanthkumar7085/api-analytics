import * as dotenv from "dotenv";
dotenv.config({
    path: ".env"
});

export default {
    schema: "./src/drizzle/schemas/*",
    driver: 'pg',
    out: "./drizzle",
    dbCredentials: {
        connectionString: process.env.LIS_DB_SERVERLES_URL_NEW as string
    }
}