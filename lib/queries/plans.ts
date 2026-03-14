import { pool } from "../db"

export async function getPlan(id: string) {
  const result = await pool.query(
    "SELECT * FROM plans WHERE id = $1",
    [id]
  )

  return result.rows[0]
}
