import { NextResponse } from "next/server"
import { pool } from "@/lib/db"


export async function GET() {
  try {
    const result = await pool.query("SELECT id, name, start_date, end_date FROM financial_cycles ORDER BY start_date DESC")

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao buscar ciclos" }, { status: 500 })
  }
}