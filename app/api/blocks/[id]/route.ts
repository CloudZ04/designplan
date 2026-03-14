import { pool } from "@/lib/db"

function toInt(value: unknown) {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? Math.round(n) : undefined
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const result = await pool.query("SELECT * FROM blocks WHERE id = $1", [id])
    const block = result.rows[0]

    if (!block) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      })
    }

    return new Response(JSON.stringify(block), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (err) {
    console.error("Error in /api/blocks/[id] GET:", err)
    return new Response(JSON.stringify({ error: "Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))

    const positionX = toInt(body.position_x)
    const positionY = toInt(body.position_y)
    const width = toInt(body.width)
    const height = toInt(body.height)
    const type = typeof body.type === "string" ? body.type : undefined
    const data = body.data !== undefined ? JSON.stringify(body.data) : undefined

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      const result = await client.query(
        `UPDATE blocks
         SET
           type = COALESCE($2, type),
           position_x = COALESCE($3, position_x),
           position_y = COALESCE($4, position_y),
           width = COALESCE($5, width),
           height = COALESCE($6, height),
           data = COALESCE($7, data),
           updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id, type, positionX, positionY, width, height, data]
      )

      const updated = result.rows[0]

      if (updated?.plan_id) {
        await client.query(
          "UPDATE plans SET updated_at = NOW() WHERE id = $1",
          [updated.plan_id]
        )
      }

      await client.query("COMMIT")

      if (!updated) {
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        })
      }

      return new Response(JSON.stringify(updated), {
        headers: { "Content-Type": "application/json" }
      })
    } catch (txErr) {
      await client.query("ROLLBACK")
      throw txErr
    } finally {
      client.release()
    }
  } catch (err) {
    console.error("Error in /api/blocks/[id] PATCH:", err)
    return new Response(JSON.stringify({ error: "Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      const result = await client.query(
        "DELETE FROM blocks WHERE id = $1 RETURNING id, plan_id",
        [id]
      )

      const deleted = result.rows[0]

      if (!deleted) {
        await client.query("ROLLBACK")
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        })
      }

      if (deleted.plan_id) {
        await client.query(
          "UPDATE plans SET updated_at = NOW() WHERE id = $1",
          [deleted.plan_id]
        )
      }

      await client.query("COMMIT")

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" }
      })
    } catch (txErr) {
      await client.query("ROLLBACK")
      throw txErr
    } finally {
      client.release()
    }
  } catch (err) {
    console.error("Error in /api/blocks/[id] DELETE:", err)
    return new Response(JSON.stringify({ error: "Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
