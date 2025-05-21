import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, Clock, MessageSquare, Film, Stars, Map, Sparkles, Lock, Heart } from 'lucide-react';

interface NavigationProps {
  isMobile: boolean;
}

const Navigation = ({ isMobile }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: '/album', icon: <BookOpen size={18} />, label: 'Our Album' },
    { to: '/timeline', icon: <Clock size={18} />, label: 'Our Journey' },
    { to: '/kuttubot', icon: <MessageSquare size={18} />, label: 'KuttuBot' },
    { to: '/media', icon: <Film size={18} />, label: 'Memories' },
    { to: '/starmap', icon: <Stars size={18} />, label: 'Our Stars' },
    { to: '/places', icon: <Map size={18} />, label: 'Our Places' },
    { to: '/future', icon: <Sparkles size={18} />, label: 'Our Future' },
    { to: '/secret', icon: <Lock size={18} />, label: 'Our Secret' },
  ];

  const activeClass = "text-rose-700 font-medium border-b-2 border-rose-300";
  const inactiveClass = "text-ivory-700 hover:text-rose-500 hover:border-b-2 hover:border-rose-200 transition-all duration-300";

  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleMenu}
          className="p-2 text-rose-700 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300 rounded-full"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-0 z-40 bg-ivory-100"
            >
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-rose-100 to-rose-200 shadow-md">
                <Heart className="text-rose-600" size={24} />
                <button
                  onClick={toggleMenu}
                  className="p-2 text-rose-700 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300 rounded-full"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              <nav className="px-6 py-8">
                <ul className="space-y-3">
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) => 
                        `block py-3 px-4 rounded-lg text-lg font-display ${isActive ? 'bg-rose-100 text-rose-700' : 'text-ivory-700'} hover:bg-rose-50 hover:text-rose-600 transition-all duration-200`
                      }
                      onClick={toggleMenu}
                    >
                      Home
                    </NavLink>
                  </li>
                  {navLinks.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) => 
                          `flex items-center gap-3 py-3 px-4 rounded-lg text-lg font-display ${isActive ? 'bg-rose-100 text-rose-700' : 'text-ivory-700'} hover:bg-rose-50 hover:text-rose-600 transition-all duration-200`
                        }
                        onClick={toggleMenu}
                      >
                        {link.icon}
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <nav className="fixed top-14 left-0 right-0 z-40 bg-ivory-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 py-2">
        <ul className="flex items-center justify-center space-x-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => 
                `text-sm font-display ${isActive ? activeClass : inactiveClass}`
              }
            >
              Home
            </NavLink>
          </li>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => 
                  `text-sm font-display flex items-center gap-1 ${isActive ? activeClass : inactiveClass}`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;