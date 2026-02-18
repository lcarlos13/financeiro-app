// app/api/test-db/route.ts
import { NextResponse } from "next/server"
import pkg from "pg"
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT NOW()")
    client.release()

    return NextResponse.json({ success: true, now: result.rows[0].now })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

