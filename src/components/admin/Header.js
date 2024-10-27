const Header = () => {
  return (
    <header className="flex items-center justify-around bg-secondary p-4  mb-0">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center justify-around space-x-4 ml-4">
      <div className="relative flex items-center">
        <span className="material-icons absolute left-3 text-gray-400">search</span>
        <input
          type="text"
          placeholder="Search Here..."
          className="pl-10 p-2 border border-gray-300 rounded w-full"
        />
      </div>

        <button className="relative">
          <span className="material-icons">notifications</span>
          <span className="absolute bottom-4 left-3 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">9</span>
        </button>
        <button className="relative">
          <span className="material-icons">email</span>
          <span className="absolute bottom-4 left-4 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-white bg-yellow-500 rounded-full">3</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
