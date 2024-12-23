import path from "path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "./drizzle";

async function runMigrations() {
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "/lib/db/migrations"),
  });

  console.log(`Migrations complete`);
  await client.end();
}

runMigrations().catch((err) => {
  console.error("Error running migrations:", err);
  process.exit(1);
});
