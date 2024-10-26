import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardCard from "./DashboardCard";
import TransactionList from "./TransactionList";

function App() {
  return (
    <div className="flex h-screen bg-primary p-10">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-secondary">
        <Header />
        <main className="p-6 space-y-6">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-3 gap-6 bg-secondary">
            <DashboardCard title="Total" value="32,568" color="bg-green-500" />
            <DashboardCard title="Debt" value="8,558" color="bg-blue-500" />
            <DashboardCard title="Available" value="X,XXX" color="bg-yellow-500" />
          </div>
          {/* Transactions */}
          <TransactionList />
        </main>
      </div>
    </div>
  );
}

export default App;
