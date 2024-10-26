const Header = () => {
  return (
    <header className="flex items-center justify-around bg-secondary p-4  mb-0">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center justify-around space-x-4 ml-4">
        <input
          type="text"
          placeholder="Search Here..."
          className="p-2 border border-gray-300 rounded"
        />
        <button className="relative">
          <span className="material-icons">notifications</span>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full"></span>
        </button>
        <button className="relative">
          <span className="material-icons">email</span>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-white bg-yellow-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
