import { Transaction } from "@/types/transaction";

type Props = {
  transaction: Transaction;
};

export default function TransactionItem({ transaction }: Props) {
  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200">
      <div>
        <p className="font-medium text-gray-800">
          {transaction.description}
        </p>
        <p className="text-sm text-gray-500">
          {transaction.date}
        </p>
      </div>

      <p
        className={`font-semibold text-lg ${
          isIncome ? "text-green-600" : "text-red-500"
        }`}
      >
        {isIncome ? "+" : "-"} R$ {transaction.amount.toFixed(2)}
      </p>
    </div>
  );
}

