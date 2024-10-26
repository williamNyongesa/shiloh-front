const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-gray-200 mt-1 flex flex-col items-center">
      <img src="/logo192.png" alt="Logo" className="w-32 mb-4 p-2" /> 
      <nav className="w-full bg-gray-200">
        <ul className="space-y-2">
          <li className="text-center text-gray-700 hover:bg-gray-300 p-2 border-b-8 border-b-white -4 rounded">Wallet</li>
          <li className="text-center text-gray-700 hover:bg-gray-300 p-2 border-b-8 border-b-white rounded">Debt</li>
          <li className="text-center text-gray-700 hover:bg-gray-300 p-4 border-b-8 border-b-white -4 rounded"></li>
          <li className="text-center text-gray-700 hover:bg-gray-300 p-4 border-b-8 border-b-white rounded"></li>
          <li className="text-center text-gray-700 hover:bg-gray-300 p-4 border-b-8 rounded"></li>
          <li className="text-center text-gray-700 bg-white hover:bg-gray-300 p-2 mt-10 rounded">Payment Admin Dashboard</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
