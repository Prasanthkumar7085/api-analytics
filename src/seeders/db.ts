// import { Pool } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';

// const pool = new Pool({ connectionString: process.env.LIS_DB_SERVERLES_URL });
// export const db = drizzle(pool)


import * as dotenv from "dotenv";
dotenv.config({
    path: ".env"
});

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.LIS_DB_SERVERLES_URL!);
export const db = drizzle(sql);