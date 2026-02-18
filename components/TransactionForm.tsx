"use client";

import { useState } from "react";
import { Transaction } from "@/types/transaction";

type Props = {
  onAddTransaction: (transaction: Transaction) => void;
};

export default function TransactionForm({ onAddTransaction }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"income" | "expense">("income");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTransaction: Transaction = {
      id: Date.now(),
      description,
      amount,
      type,
      date: new Date().toISOString().split("T")[0],
    };

    onAddTransaction(newTransaction);

    setDescription("");
    setAmount(0);
    setType("income");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Nova Transação
      </h2>

      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
        className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value as "income" | "expense")
        }
        className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="income">Receita</option>
        <option value="expense">Despesa</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
      >
        Adicionar
      </button>
    </form>
  );
}

