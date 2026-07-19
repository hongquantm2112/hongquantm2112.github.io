import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations connect directly (unpooled) — Neon recommends this to
    // avoid pgbouncer prepared-statement issues during schema changes.
    url: process.env["DIRECT_URL"],
  },
});
