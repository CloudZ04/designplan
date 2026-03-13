import { pool } from "@/lib/db";

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM plans ORDER BY created_at DESC"
  );

  return Response.json(result.rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description } = body;

  const result = await pool.query(
    `INSERT INTO plans (title, description)
     VALUES ($1,$2)
     RETURNING *`,
    [title, description]
  );

  return Response.json(result.rows[0]);
}