"use client";

import { useState } from "react";
import { Transaction } from "@/types/transaction";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";


export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)
    
  const balance = totalIncome - totalExpense


  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  function handleDelete(id: number) {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    )
  }     

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
	  <div className="bg-white shadow-md rounded-xl p-4">
	    <p className="text-gray-500 text-sm">Entradas</p>
	    <p className="text-green-500 font-bold text-lg">
	      R$ {totalIncome}
	    </p>
	  </div>

	  <div className="bg-white shadow-md rounded-xl p-4">
	    <p className="text-gray-500 text-sm">Saídas</p>
	    <p className="text-red-500 font-bold text-lg">
	      R$ {totalExpense}
	    </p>
	  </div>

	  <div className="bg-white shadow-md rounded-xl p-4">
	    <p className="text-gray-500 text-sm">Saldo</p>
	    <p
	      className={`font-bold text-lg ${
		balance >= 0 ? "text-green-600" : "text-red-600"
	      }`}
	    >
	      R$ {balance}
	    </p>
	  </div>
	</div>

        <TransactionForm onAddTransaction={handleAddTransaction} />
        <TransactionList transactions={transactions} onDelete={handleDelete} />

      </div>
    </main>
  );
}



