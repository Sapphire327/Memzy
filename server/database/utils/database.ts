import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../schema'
export const db = drizzle(process.env.DATABASE_URL!,{schema});

export const tables = schema;
export { and, eq, not, or } from 'drizzle-orm'

