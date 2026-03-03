/**
 * Header Component - Modern glassmorphism navigation
 */

import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, BookmarkPlus, User, LogOut, Menu, X } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
        isActive(to)
          ? 'bg-brand-500/15 text-brand-400'
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/25 transition-shadow group-hover:shadow-brand-500/40">
            <Film className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white">
            Stro<span className="text-brand-400">mae</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink to="/">Browse</NavLink>
              <NavLink to="/watchlist">
                <BookmarkPlus className="h-4 w-4" />
                Watchlist
              </NavLink>
              <NavLink to="/profile">
                <User className="h-4 w-4" />
                {user?.username}
              </NavLink>
              <button onClick={handleLogout} className="btn-ghost btn-sm ml-2 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/">Browse</NavLink>
              <Link to="/login" className="btn-outline btn-sm ml-2">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn-ghost p-2 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="animate-slide-down border-t border-gray-800/50 bg-gray-950/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Browse</NavLink>
                <NavLink to="/watchlist" onClick={() => setMobileMenuOpen(false)}>
                  <BookmarkPlus className="h-4 w-4" />
                  Watchlist
                </NavLink>
                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <User className="h-4 w-4" />
                  {user?.username}
                </NavLink>
                <button onClick={handleLogout} className="btn-danger mt-2 w-full">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Browse</NavLink>
                <div className="mt-2 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-outline w-full text-center">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full text-center">
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
