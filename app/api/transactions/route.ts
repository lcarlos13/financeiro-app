// app/api/transactions/route.ts
import { NextResponse } from "next/server"
import pkg from "pg"
const { Pool } = pkg

// Pool de conexão com Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

// Função auxiliar para pegar JSON da requisição
async function getBody(req: Request) {
  try {
    return await req.json()
  } catch {
    return {}
  }
}

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM transactions ORDER BY id DESC")
    client.release()

    return NextResponse.json({ success: true, transactions: result.rows })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await getBody(req)
    const { description, amount, type } = body

    if (!description || !amount || !type) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 })
    }

    const client = await pool.connect()
    const result = await client.query(
      "INSERT INTO transactions (description, amount, type) VALUES ($1, $2, $3) RETURNING *",
      [description, amount, type]
    )
    client.release()

    return NextResponse.json({ success: true, transaction: result.rows[0] })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    if (!id) {
      return NextResponse.json({ success: false, error: "Id não fornecido" }, { status: 400 })
    }

    const client = await pool.connect()
    await client.query("DELETE FROM transactions WHERE id = $1", [id])
    client.release()

    return NextResponse.json({ success: true, deletedId: id })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

