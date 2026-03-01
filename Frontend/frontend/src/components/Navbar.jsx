import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, User, LogOut, Utensils } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/?term=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const isPrivileged = user?.roles.includes('ROLE_PRIVILEGED_USER') || user?.roles.includes('ROLE_ADMIN');

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 h-[72px] flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
          <Utensils className="h-8 w-8 text-orange-500 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-2xl font-black text-gray-900 tracking-tighter">Recipify</span>
        </Link>

        <div className="flex-grow max-w-2xl relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for your favorite Indian dishes..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 font-medium placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="flex items-center space-x-8 flex-shrink-0">
          {user ? (
            <>
              {isPrivileged && (
                <Link to="/upload" className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors font-bold text-sm">
                  <PlusCircle className="h-5 w-5" />
                  <span className="hidden md:inline">Upload</span>
                </Link>
              )}
              <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors font-bold text-sm">
                <User className="h-5 w-5" />
                <span className="hidden md:inline">Profile</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors font-bold text-sm">
                <LogOut className="h-5 w-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-orange-500 font-bold text-sm transition-colors">Sign In</Link>
              <Link to="/signup" className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
