const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-200 p-4 flex flex-col items-center">
      <img src="/logo192.png" alt="Logo" className="w-32 mb-4" /> {/* Replace with your logo */}
      <nav className="w-full">
        <ul className="space-y-2">
          <li className="text-gray-700 hover:bg-gray-300 p-2 rounded">Wallet</li>
          <li className="text-gray-700 hover:bg-gray-300 p-2 rounded">Debt</li>
          <li className="text-gray-700 bg-white hover:bg-gray-300 p-2 rounded">Payment Admin Dashboard</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
