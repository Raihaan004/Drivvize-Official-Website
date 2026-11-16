import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load .env.local for local drizzle-kit commands
config({ path: '.env.local' });
config(); // fallback to .env if present

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Prefer unpooled direct connection for migrations/push per Neon best practices
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!,
  },
});

