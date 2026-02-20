import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (
    email !== process.env.AUTH_EMAIL ||
    password !== process.env.AUTH_PASSWORD
  ) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true })

  // IMPORTANTE: cookie precisa ser setado no response
  response.cookies.set({
    name: "auth",
    value: "true",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 horas
  })

  return response
}
