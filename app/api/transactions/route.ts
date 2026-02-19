// app/api/transactions/route.ts
import { NextResponse } from "next/server"
import { pool } from "@/lib/db"


// Função auxiliar para pegar JSON da requisição
async function getBody(req: Request) {
  try {
    return await req.json()
  } catch {
    return {}
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cycleId = searchParams.get("cycleId")

    if (!cycleId) {
      return NextResponse.json(
        { error: "cycleId é obrigatório" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `
      SELECT *
      FROM transactions
      WHERE cycle_id = $1
      ORDER BY created_at DESC
      `,
      [cycleId]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { description, amount, type, date, cycle_id } = body

    if (!cycle_id) {
      return NextResponse.json(
        { error: "cycle_id é obrigatório" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `
      INSERT INTO transactions
      (description, amount, type, date, cycle_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [description, amount, type, date, cycle_id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    )
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

