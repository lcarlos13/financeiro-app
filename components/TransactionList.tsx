import { Transaction } from "@/types/transaction"

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: number) => void
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  return (
    <div className="flex flex-col gap-2">
      {transactions.map((t) => (
        <div key={t.id} className="flex justify-between p-2 border rounded bg-white shadow-sm">
          <div>
            <p className="font-semibold">{t.description}</p>
            <p className={t.type === "income" ? "text-green-600" : "text-red-600"}>R$ {t.amount}</p>
          </div>
          <button onClick={() => onDelete(t.id)} className="text-red-600 font-bold hover:text-red-800">
            X
          </button>
        </div>
      ))}
    </div>
  )
}

