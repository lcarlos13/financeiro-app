"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.replace("/")
      router.refresh()

    } else {
      alert("Email ou senha inválidos")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md items-center justify-center px-4">

          {/* Background decorativo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur-xl opacity-30"></div>

          {/* Card principal */}
          <div className="relative bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl p-8 shadow-2xl text-center overflow-hidden">

            {/* Efeito brilho sutil */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

            {/* Logo */}
            <div className="flex justify-center mb-5">
              <div className="bg-white p-3 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300">
                <img
                  src="/icon-192.png"
                  alt="Logo"
                  className="w-20 h-20"
                />
              </div>
            </div>

            {/* Título */}
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Gerenciador Financeiro
            </h1>

            {/* Subtítulo */}
            <p className="text-blue-100 mt-2 text-sm md:text-base">
              Acesse sua conta
            </p>

        </div>

      <div className="flex justify-center mb-5">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg w-80"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border-2 border-gray-700 rounded-lg mb-4 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 border-2 border-gray-700 rounded-lg mb-6 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
          >
            Entrar
          </button>
        </form>
        </div>
      </div>
    </div>
  )
}
