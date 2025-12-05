// ============================================
// DATABASE CONNECTION & CONFIGURATION
// ============================================
// This file handles all PostgreSQL database connections and queries
// We use the 'pg' package (node-postgres) for type-safe database operations

import pkg from "pg"
const { Pool } = pkg

// Initialize connection pool
// Connection pooling manages multiple connections efficiently
// maxConnections: 20 concurrent connections max
// idleTimeoutMillis: Close idle connections after 30 seconds
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "learnly",
  max: 20,
  idleTimeoutMillis: 30000,
})

// Test database connection on startup
pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err)
})

// Helper function to execute queries
export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    console.log(`[DB Query] ${duration}ms - ${text.split("\n")[0]}`)
    return {
      rows: result.rows as T[],
      rowCount: result.rowCount || 0,
    }
  } catch (error) {
    console.error("Database Query Error:", error)
    throw error
  }
}

// Helper function for transactions
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export default pool
