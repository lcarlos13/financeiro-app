"use client"
import { useEffect, useState } from "react"
import TransactionForm from "@/components/TransactionForm"
import TransactionList from "@/components/TransactionList"
import { Transaction } from "@/types/transaction"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Totais derivados
  const totalIncome = transactions
  .filter((t) => t.type === "income")
  .reduce((acc, t) => acc + Number(t.amount), 0)

  const totalExpense = transactions
  .filter((t) => t.type === "expense")
  .reduce((acc, t) => acc + Number(t.amount), 0)


  const balance = totalIncome - totalExpense

  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch("/api/transactions")
      const data = await res.json()
      if (data.success) setTransactions(data.transactions)
    }
    fetchTransactions()
  }, [])

  async function handleAddTransaction(transaction: { description: string; amount: number; type: "income" | "expense" }) {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })
      const data = await res.json()
      if (data.success) setTransactions((prev) => [data.transaction, ...prev])
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

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">Controle Financeiro</h1>

        {/* Totais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center border border-blue-800">
            <p className="text-sm font-medium text-blue-900">Receita</p>
            <p className="text-2xl font-bold text-green-600 mt-1">R$ {totalIncome}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center border border-red-600">
            <p className="text-sm font-medium text-blue-900">Despesa</p>
            <p className="text-2xl font-bold text-red-600 mt-1">R$ {totalExpense}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center border border-green-700">
            <p className="text-sm font-medium text-blue-900">Saldo</p>
            <p className="text-2xl font-bold text-green-800 mt-1">R$ {balance}</p>
          </div>
        </div>

        {/* Formulário */}
        <TransactionForm onAddTransaction={handleAddTransaction} />

        {/* Lista de transações */}
        <TransactionList transactions={transactions} onDelete={handleDelete} />
      </div>
    </main>
  )
}
