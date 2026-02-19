"use client"
import { useState } from "react"

interface TransactionFormProps {
  onAddTransaction: (transaction: { description: string; amount: number; type: "income" | "fixed" | "card" }) => void
}

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "fixed" | "card">("income")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description || !amount) return

    onAddTransaction({ description, amount: Number(amount), type })
    setDescription("")
    setAmount("")
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 bg-white p-4 rounded-md shadow">
      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 border rounded"
      />
      <select value={type} onChange={(e) => setType(e.target.value as "income" | "fixed" | "card")} className="p-2 border rounded">
        <option value="income">Receita</option>
        <option value="fixed">Despesa Fixa</option>
        <option value="card">Despesa Cartão</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
        Adicionar
      </button>
    </form>
  )
}

