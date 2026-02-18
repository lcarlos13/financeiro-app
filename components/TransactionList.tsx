import { Transaction } from "@/types/transaction";
import TransactionItem from "./TransactionItem";

type Transaction = {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
}

type Props = {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export default function TransactionList({ transactions, onDelete }: Props) {
  return (
    <div className="space-y-3 mt-6">
      {transactions.length === 0 && (
        <p className="text-gray-400 text-center">
          Nenhuma transação cadastrada
        </p>
      )}

      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex justify-between items-center bg-white shadow-md rounded-xl p-4"
        >
          <div>
            <p className="font-semibold">{transaction.title}</p>
            <p
              className={`text-sm ${
                transaction.type === "income"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              R$ {transaction.amount}
            </p>
          </div>

          <button
            onClick={() => onDelete(transaction.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Excluir
          </button>
        </div>
      ))}
    </div>
  )
}

