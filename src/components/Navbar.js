import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <img src="/logo192.png" alt="Shiloh Logo" className="h-10 w-10" />
          <span className="text-white font-bold text-xl">Shiloh College</span>
        </div>
        <button
          onClick={toggleMenu}
          className="text-white md:hidden"
        >
          <span className="material-icons">menu</span>
        </button>
        <ul
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex md:space-x-4 absolute md:static left-0 right-0 top-16 md:top-0 bg-blue-600 md:bg-transparent md:flex-row flex-col md:space-y-0 space-y-2 p-4 md:p-0`}
        >
          <li>
            <Link
              to="/"
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Signup
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
