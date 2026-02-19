export type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "income" | "fixed" | "card";
  date: string;
};

