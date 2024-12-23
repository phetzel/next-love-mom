import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

// const connectionString = env.DATABASE_URL;
const connectionString =
  "postgres://neondb_owner:UALtgOf7E5oS@ep-bold-base-a6kru0ga-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require";
// const connectionString =
// "postgres://postgres:O1K1EAXYJEvF4YBPLufM55xWBtj77z0JC6uZyvCX47U@localhost:54322/mom_postgres";
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const client = postgres(connectionString);
export const db = drizzle(client, { schema });
