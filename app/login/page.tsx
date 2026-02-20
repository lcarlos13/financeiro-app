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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Decorativo - Adicionado z-0 e movido para fora do container do card */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 blur-3xl opacity-20 z-0"></div>

      <div className="w-full max-w-md z-10"> {/* z-10 garante que o conteúdo fique acima do fundo */}
        
        {/* Card de Cabeçalho */}
        <div className="relative bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-3xl p-8 shadow-xl text-center overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <div className="flex justify-center mb-5">
            <div className="bg-white p-3 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300">
              <img src="/icon-192.png" alt="Logo" className="w-16 h-16" />
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            Gerenciador Financeiro
          </h1>
          <p className="text-blue-100 mt-2 text-sm">Acesse sua conta</p>
        </div>

        {/* Formulário */}
        <div className="bg-white p-8 rounded-b-3xl shadow-lg">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-colors mt-2"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}