import { pool } from "@/lib/db"
import { randomUUID } from "crypto"

function toInt(value: unknown, fallback: number) {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? Math.round(n) : fallback
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const planId = searchParams.get("plan_id")

    if (!planId) {
      return new Response(JSON.stringify({ error: "plan_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    const result = await pool.query(
      "SELECT * FROM blocks WHERE plan_id = $1 ORDER BY created_at ASC",
      [planId]
    )

    return new Response(JSON.stringify(result.rows), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (err) {
    console.error("Error in /api/blocks GET:", err)
    return new Response(JSON.stringify({ error: "Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("POST body received:", body)  // <--- important

    // ensure plan_id exists
    if (!body.plan_id) {
      throw new Error("plan_id missing in request body")
    }

    if (!body.type) {
      return new Response(JSON.stringify({ error: "type is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      const result = await client.query(
        `INSERT INTO blocks
         (id, plan_id, type, position_x, position_y, width, height, data, created_at, updated_at)
         VALUES
         ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
         RETURNING *`,
        [
          randomUUID(),
          body.plan_id,
          body.type,
          toInt(body.position_x, 200),
          toInt(body.position_y, 150),
          toInt(body.width, 220),
          toInt(body.height, 120),
          JSON.stringify(body.data ?? {})
        ]
      )

      await client.query(
        "UPDATE plans SET updated_at = NOW() WHERE id = $1",
        [body.plan_id]
      )

      await client.query("COMMIT")

      return new Response(JSON.stringify(result.rows[0]), {
        headers: { "Content-Type": "application/json" }
      })
    } catch (txErr) {
      await client.query("ROLLBACK")
      throw txErr
    } finally {
      client.release()
    }
  } catch (err) {
    console.error("Error in /api/blocks POST:", err)
    return new Response(JSON.stringify({ error: "Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
