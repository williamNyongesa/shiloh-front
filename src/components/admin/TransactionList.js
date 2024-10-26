import Pagination from "./Pagination";

const TransactionList = () => {
  const transactions = [
    { id: "#KLA-237-393-950", name: "CodeAstrology.com", amount: "$4,67,859", time: "5 min ago" },
    { id: "#KLA-237-393-950", name: "HSJ Express.com", amount: "$89,859", time: "10 min ago" },
    { id: "#KLA-237-393-950", name: "InventiveShamin.Inc", amount: "$3,43,67,859", time: "15 min ago" },
    { id: "#KLA-237-393-950", name: "AvadaroLife.Inc", amount: "$2,07,859", time: "20 min ago" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-lg mb-4">Latest Transactions</h3>
      <ul className="space-y-4">
        {transactions.map((transaction, index) => (
          <li key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{transaction.id}</p>
              <p className="text-gray-500">{transaction.name}</p>
            </div>
            <p className="font-semibold text-gray-800">{transaction.amount}</p>
            <p className="text-gray-500">{transaction.time}</p>
          </li>
        ))}
        </ul>
        <Pagination />
    </div>
  );
};

export default TransactionList;
