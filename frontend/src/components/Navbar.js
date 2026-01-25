import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Menu, X, User, LogOut, BookOpen, LayoutDashboard, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-100' 
          : 'bg-transparent'
      }`} 
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#053d6c] to-[#0a4e8a] flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-lg font-['Outfit']">SC</span>
            </motion.div>
            <span className="font-['Outfit'] font-bold text-xl text-[#053d6c] hidden sm:block group-hover:text-[#f16a2f] transition-colors">
              The Skill Circuit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.name.toLowerCase()}`}
                className={`relative px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-[#f16a2f]'
                    : 'text-[#053d6c] hover:text-[#f16a2f] hover:bg-[#f16a2f]/5'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="navIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f16a2f]"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100" data-testid="user-menu-trigger">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full border-2 border-[#f16a2f]/20" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#053d6c] to-[#0a4e8a] flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-[#053d6c] font-medium hidden lg:block">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-xl border-slate-100">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <p className="font-semibold text-[#053d6c]">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {isAdmin ? (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer" data-testid="admin-dashboard-link">
                        <Settings className="w-4 h-4 mr-3 text-[#f16a2f]" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer" data-testid="dashboard-link">
                          <LayoutDashboard className="w-4 h-4 mr-3 text-[#f16a2f]" />
                          My Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/courses')} className="cursor-pointer" data-testid="my-courses-link">
                          <BookOpen className="w-4 h-4 mr-3 text-[#f16a2f]" />
                          My Courses
                        </DropdownMenuItem>
                      </>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600" data-testid="logout-btn">
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-[#053d6c] font-medium px-5 py-2.5 rounded-full hover:bg-slate-100" data-testid="login-btn">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-primary px-6 py-2.5" data-testid="signup-btn">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#053d6c]" />
            ) : (
              <Menu className="w-6 h-6 text-[#053d6c]" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t border-slate-100 shadow-xl" 
          data-testid="mobile-menu"
        >
          <div className="px-6 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-xl font-medium transition-all ${
                  isActive(link.path) 
                    ? 'text-[#f16a2f] bg-[#f16a2f]/5' 
                    : 'text-[#053d6c] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#053d6c] to-[#0a4e8a] flex items-center justify-center">
                        <span className="text-white font-semibold">{user.name?.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[#053d6c]">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={isAdmin ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-xl text-[#053d6c] font-medium hover:bg-slate-50"
                  >
                    {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full py-3 px-4 rounded-xl text-left text-red-600 font-medium hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full py-3 rounded-full border-[#053d6c] text-[#053d6c]">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full py-3 btn-primary">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
