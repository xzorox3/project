// src/components/Navbar/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import {
  faMoon,
  faSun,
  faBars,
  faTimes,
  faUserCircle,
  faHome,
  faBuilding,
  faInfoCircle,
  faEnvelope,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import logoImage from "../../assets/image/logo.png";

function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", href: "/", icon: faHome },
    { name: "About", href: "/about", icon: faInfoCircle },
    { name: "Departments", href: "/department", icon: faBuilding },
    { name: "Contact", href: "/contact", icon: faEnvelope },
  ];

  useEffect(() => {
    // Check authentication status from cookies
    const token = Cookies.get("authToken");
    const userRole = Cookies.get("userRole");
    setIsLoggedIn(!!token);
    setIsAdmin(userRole === "admin");

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(); // This calls the toggleDarkMode function from App.jsx
  };

  const handleLogout = () => {
    // Remove authentication cookies
    Cookies.remove("authToken");
    Cookies.remove("user");
    Cookies.remove("userRole");
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/"; // Redirect to home page
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl border-b border-gray-200/20 dark:border-gray-700/20"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <img
                src={logoImage}
                alt="FCI Logo"
                className="h-10 w-10 lg:h-12 lg:w-12  transition-all "
              />
            </motion.div>
            <div className="flex items-center">
              <span className="text-lg lg:text-2xl font-bold">
                <span className="text-blue-600">FCI</span>
                <span className="text-black dark:text-white">HUB</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={item.href}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-700/10 rounded-xl border border-blue-200 dark:border-blue-700"
                        initial={false}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            {/* Admin Dashboard Link */}
            {isLoggedIn && isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * navigationItems.length }}
              >
                <Link
                  to="/admin"
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/admin"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <FontAwesomeIcon icon={faCog} className="h-4 w-4" />
                  <span>Admin</span>
                  {location.pathname === "/admin" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-700/10 rounded-xl border border-blue-200 dark:border-blue-700"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            )}

            {/* Profile Link */}
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (navigationItems.length + 1) }}
              >
                <Link
                  to="/profile"
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/profile"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="h-4 w-4" />
                  <span>Profile</span>
                  {location.pathname === "/profile" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-700/10 rounded-xl border border-blue-200 dark:border-blue-700"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            )}

            {/* Logout Button */}
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (navigationItems.length + 2) }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
            >
              <FontAwesomeIcon
                icon={darkMode ? faSun : faMoon}
                className="h-5 w-5"
              />
            </motion.button>

            {/* Auth Button */}
            <div className="hidden md:block">
              {!isLoggedIn && (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg hover:shadow-xl text-sm"
                  >
                    Login
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md"
            >
              <FontAwesomeIcon
                icon={menuOpen ? faTimes : faBars}
                className="h-5 w-5"
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20 shadow-xl"
          >
            <div className="px-4 py-6 space-y-3">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Admin Dashboard Link - Mobile */}
              {isLoggedIn && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    location.pathname === "/admin"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {/* Profile Link - Mobile */}
              {isLoggedIn && (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    location.pathname === "/profile"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg"
                  >
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
