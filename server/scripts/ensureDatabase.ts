import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({ override: true });

async function ensureDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const parsed = new URL(databaseUrl);
  const databaseName = parsed.pathname.replace(/^\//, "");
  if (!databaseName) {
    throw new Error("DATABASE_URL must include a database name.");
  }

  const adminUrl = new URL(databaseUrl);
  adminUrl.pathname = "/postgres";

  const client = new Client({
    connectionString: adminUrl.toString()
  });

  await client.connect();

  const existing = await client.query<{ datname: string }>(
    "SELECT datname FROM pg_database WHERE datname = $1",
    [databaseName]
  );

  if (existing.rowCount === 0) {
    await client.query(`CREATE DATABASE "${databaseName}"`);
    // eslint-disable-next-line no-console
    console.log(`Created database "${databaseName}".`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Database "${databaseName}" already exists.`);
  }

  await client.end();
}

ensureDatabase().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
