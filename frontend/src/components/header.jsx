import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      {/* Left Section - Title */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Solar Info</h1>
      </div>

      {/* Middle Section - Tabs */}
      <nav className="flex space-x-6">
        <Link to="/homepage" className="hover:text-blue-400 transition-colors">Home</Link>
        <Link to="/planets" className="hover:text-blue-400 transition-colors">Planets</Link>
        <Link to="/asteroid" className="hover:text-blue-400 transition-colors">Asteroid</Link>
        <Link to="/comet" className="hover:text-blue-400 transition-colors">Comet</Link>
        <Link to="/quiz" className="hover:text-blue-400 transition-colors">Quiz</Link>
      </nav>

      {/* Right Section - Buttons */}
      <div className="flex space-x-4">
        <Link to="/">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Sign Up
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;