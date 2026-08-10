import { PrismaClient } from "./generated/prisma/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend directory regardless of process working directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/identity_graph?schema=public";

// 1. Establish the PostgreSQL connection pool using pg
const pool = new Pool({ connectionString });

// 2. Instantiate the Prisma Pg driver adapter
const adapter = new PrismaPg(pool);

// 3. Create the PrismaClient using the adapter
export const prisma = new PrismaClient({ adapter });
