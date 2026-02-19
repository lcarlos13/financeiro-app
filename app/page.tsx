"use client"
import { useEffect, useState } from "react"
import TransactionForm from "@/components/TransactionForm"
import TransactionList from "@/components/TransactionList"
import { Transaction } from "@/types/transaction"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [openTab, setOpenTab] = useState<string | null>(null)

  const [cycles, setCycles] = useState<any[]>([])
  const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null)


  function toggleTab(tab: string) {
    setOpenTab(prev => (prev === tab ? null : tab))
  }

  const incomes = transactions.filter(t => t.type === "income")
  const fixedExpenses = transactions.filter(t => t.type === "fixed")
  const cardExpenses = transactions.filter(t => t.type === "card")


  // Totais derivados
  const totalIncome = transactions
  .filter((t) => t.type === "income")
  .reduce((acc, t) => acc + Number(t.amount), 0)

  const totalFixed = transactions
  .filter((t) => t.type === "fixed")
  .reduce((acc, t) => acc + Number(t.amount), 0)

  const totalCard = transactions
  .filter((t) => t.type === "card")
  .reduce((acc, t) => acc + Number(t.amount), 0)


  const totalExpense = totalFixed + totalCard
  const balance = totalIncome - totalExpense


  useEffect(() => {
    async function fetchCycles() {
      const res = await fetch("/api/cycles")
      const data = await res.json()

      setCycles(data)

      if (data.length > 0) {
        setSelectedCycleId(data[0].id)
      }
    }

    fetchCycles()
  }, [])


  useEffect(() => {
    if (!selectedCycleId) return

    async function fetchTransactions() {
      const res = await fetch(
        `/api/transactions?cycleId=${selectedCycleId}`
      )
      const data = await res.json()
      setTransactions(data)
    }

    fetchTransactions()
  }, [selectedCycleId])


  async function handleAddTransaction(transaction: {
    description: string
    amount: number
    type: "income" | "fixed" | "card"
  }) {
    try {
      if (!selectedCycleId) return

      const today = new Date().toISOString().split("T")[0] 
      // formato YYYY-MM-DD

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...transaction,
          date: today,
          cycle_id: selectedCycleId,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setTransactions((prev) => [data, ...prev])
      }

    } catch (err) {
      console.error(err)
    }
  }


  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/transactions?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  function formatDateBR(dateString: string) {
    const date = new Date(dateString)

    const day = String(date.getUTCDate()).padStart(2, "0")
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const year = date.getUTCFullYear()

    return `${day}-${month}-${year}`
  }


  // ================= UI COMPONENT =================
  function Accordion({
    id,
    title,
    icon,
    children,
  }: {
    id: string
    title: string
    icon: string
    children: React.ReactNode
  }) {
    const isOpen = openTab === id

    return (
      <div className="bg-blue-100 border-2 border-black rounded-2xl overflow-hidden shadow-md">
        <button
          onClick={() => toggleTab(id)}
          className="w-full flex justify-between items-center p-4 text-black font-semibold"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            {title}
          </span>

          <span
            className={`transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 border-t-2 border-black bg-white text-black">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4 space-y-6">

        <div className="relative">

            {/* Background decorativo */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30"></div>

            {/* Card principal */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-2xl text-center overflow-hidden">

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
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                Gerenciador Financeiro
              </h1>

              {/* Subtítulo */}
              <p className="text-blue-100 mt-3 text-sm md:text-base">
                Controle inteligente das suas receitas e despesas
              </p>

          </div>
        </div>

        {cycles.length > 0 && selectedCycleId && (
          <div className="bg-white rounded-2xl shadow-md p-4 border-2 border-black">

            <label className="block text-black font-semibold mb-2">
              📅 Mês de Referência
            </label>

            <select
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(Number(e.target.value))}
              className="w-full p-3 border-2 border-gray-700 rounded-xl text-black bg-gray-50"
            >
              {cycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.name} ({formatDateBR(cycle.start_date)} → {formatDateBR(cycle.end_date)}
)
                </option>
              ))}
            </select>

          </div>
        )}


        {/* ================= TOTAIS ================= */}
        <Accordion id="totais" title="Totais" icon="📊">
          <div className="space-y-2">
            <p>
              Receitas:{" "}
              <span className="text-green-600 font-semibold">
                R$ {totalIncome.toFixed(2)}
              </span>
            </p>
            <p>
              Despesas Fixas:{" "}
              <span className="text-red-600 font-semibold">
                R$ {totalFixed.toFixed(2)}
              </span>
            </p>
            <p>
              Despesas Cartão:{" "}
              <span className="text-red-600 font-semibold">
                R$ {totalCard.toFixed(2)}
              </span>
            </p>
            <p
              className={`font-bold ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Saldo: R$ {balance.toFixed(2)}
            </p>
          </div>
        </Accordion>

        {/* ================= GANHOS ================= */}
        <Accordion id="ganhos" title="Ganhos" icon="💰">
          <div className="mb-4 p-3 border-2 border-green-600 rounded-lg text-green-600 font-semibold bg-green-50">
            Total Ganhos: R$ {totalIncome.toFixed(2)}
          </div>

          {incomes.map(t => (
            <div
              key={t.id}
              className="flex justify-between py-2 border-b border-gray-300"
            >
              <span>{t.description}</span>
              <div className="flex gap-3">
                <span className="text-green-600 font-semibold">
                  R$ {Number(t.amount).toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600 font-bold"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </Accordion>

        {/* ================= FIXED ================= */}
        <Accordion id="fixed" title="Despesas Fixas" icon="🏠">
          <div className="mb-4 p-3 border-2 border-red-600 rounded-lg text-red-600 font-semibold bg-red-50">
            Total Despesas Fixas: R$ {totalFixed.toFixed(2)}
          </div>

          {fixedExpenses.map(t => (
            <div
              key={t.id}
              className="flex justify-between py-2 border-b border-gray-300"
            >
              <span>{t.description}</span>
              <div className="flex gap-3">
                <span className="text-red-600 font-semibold">
                  R$ {Number(t.amount).toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600 font-bold"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </Accordion>

        {/* ================= CARD ================= */}
        <Accordion id="card" title="Despesas Cartão" icon="💳">
          <div className="mb-3 p-3 border-2 border-red-600 rounded-lg text-red-600 font-semibold bg-red-50">
            Total Cartão: R$ {totalCard.toFixed(2)}
          </div>

          <div
            className={`mb-4 p-3 border-2 rounded-lg font-bold ${
              balance >= 0
                ? "border-green-600 text-green-600 bg-green-50"
                : "border-red-600 text-red-600 bg-red-50"
            }`}
          >
            Saldo Atual: R$ {balance.toFixed(2)}
          </div>

          {cardExpenses.map(t => (
            <div
              key={t.id}
              className="flex justify-between py-2 border-b border-gray-300"
            >
              <span>{t.description}</span>
              <div className="flex gap-3">
                <span className="text-red-600 font-semibold">
                  R$ {Number(t.amount).toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600 font-bold"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </Accordion>
        {/* ==================== ADICIONAR ==================== */}
        <Accordion id="add" title="Adicionar" icon="➕">
            <TransactionForm onAddTransaction={handleAddTransaction} />
        </Accordion>

      </div>
    </div>
  )
}