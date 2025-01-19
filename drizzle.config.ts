import { defineConfig } from "drizzle-kit";

// import * as dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });

export default defineConfig({
  out: "./lib/db/migrations",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
    // url: env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});
