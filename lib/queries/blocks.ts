import { pool } from "../db"

export async function getBlocks(planId: string) {
  const result = await pool.query(
    "SELECT * FROM blocks WHERE plan_id = $1 ORDER BY created_at ASC",
    [planId]
  )

  return result.rows
}
