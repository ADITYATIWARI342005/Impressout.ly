import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For local development without database, create mock functions
const createMockStorage = () => ({
  pool: null as any,
  db: null as any,
  // Mock methods that return empty arrays/objects
  getUserResumes: async () => [],
  getUserPortfolios: async () => [],
  getUserCoverLetters: async () => [],
  getUserProjects: async () => [],
  getResume: async () => null,
  createResume: async (data: any) => ({ id: 'mock-id', ...data, createdAt: new Date(), updatedAt: new Date() }),
  updateResume: async (id: string, data: any) => ({ id, ...data, updatedAt: new Date() }),
  deleteResume: async () => true,
  createPortfolio: async (data: any) => ({ id: 'mock-id', ...data, createdAt: new Date(), updatedAt: new Date() }),
  createCoverLetter: async (data: any) => ({ id: 'mock-id', ...data, createdAt: new Date(), updatedAt: new Date() }),
  createProject: async (data: any) => ({ id: 'mock-id', ...data, createdAt: new Date(), updatedAt: new Date() }),
});

let pool: Pool | null = null;
let db: any = null;

try {
  if (process.env.DATABASE_URL) {
    const ssl = process.env.DB_SSL === 'true';
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: ssl ? { rejectUnauthorized: false } : undefined } as any);
    db = drizzle({ client: pool, schema });
  } else {
    // Use mock storage for local development
    const mockStorage = createMockStorage();
    pool = mockStorage.pool;
    db = mockStorage.db;
  }
} catch (error) {
  console.warn('Database connection failed, using mock storage:', error);
  const mockStorage = createMockStorage();
  pool = mockStorage.pool;
  db = mockStorage.db;
}

export { pool, db };