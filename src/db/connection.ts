

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import 'dotenv/config';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    min: 2,
    max: 10,
});

export const db = drizzle(pool);


pool.on("error", (err) => {
    console.error("Unexpected DB error", err);
});