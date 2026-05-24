import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdSettings } from "react-icons/md";
import Logoo from "../assets/logo.png";
import { useAuthContext } from "../context/AuthContext";

interface MainLink {
  to: string;
  text: string;
}
interface DropdownLink extends MainLink {
  isRed?: boolean;
}

const mainLinks: (MainLink & { requiresLogin?: boolean })[] = [
  { to: "/home", text: "Home" },
  { to: "/aboutus", text: "About Us" },
  { to: "/search-product", text: "Search Product", requiresLogin: true },
  { to: "/eco-score-calculator", text: "EcoScore Calculator" },
];

const dropdownLinks: DropdownLink[] = [
  { to: "/dashboard", text: "Dashboard" },
  { to: "/collections", text: "Collections"},
  { to: "/settings", text: "Settings" },
  { to: "/logout", text: "Logout", isRed: true },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const location = useLocation();

  // Close dropdown and menu on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const {
    user: { isLoggedIn },
  } = useAuthContext();

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 dark:bg-gray-900/95">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-6">
          <a
            href="/home"
            className="flex items-center space-x-3 rtl:space-x-reverse group"
          >
            <img
              src={Logoo}
              className="h-12 transition-transform group-hover:scale-105"
              alt="Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-800 dark:text-white">
              alt<span className="text-green-600">Eco</span>
            </span>
          </a>
          <button
            onClick={handleMenuToggle}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-600 rounded-lg md:hidden hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-green-900/50"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`w-full md:block md:w-auto ${
              isMenuOpen ? "" : "hidden"
            }`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col md:flex-row md:space-x-6 rtl:space-x-reverse mt-4 md:mt-0">
              {mainLinks
                .filter((link) => !link.requiresLogin || isLoggedIn)
                .map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `h-11 flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? "text-green-700 bg-green-50/80 dark:bg-green-900/20 dark:text-green-400"
                            : "text-gray-600 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-600/50"
                        }`
                      }
                    >
                      {link.text}
                    </NavLink>
                  </li>
                ))}

              {isLoggedIn ? (
                <li className="relative inline-block h-11">
                  <button
                    onClick={toggleDropdown}
                    className="h-11 flex items-center gap-2 px-3 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
                    tabIndex={0}
                    aria-haspopup="menu"
                    aria-expanded={isDropdownOpen}
                  >
                    <MdSettings
                      size={22}
                      className="text-green-600 dark:text-green-400"
                    />
                    <span className="md:hidden font-medium">Settings</span>
                  </button>

                  {isDropdownOpen && (
                    <ul
                      role="menu"
                      className={`
                        w-full md:w-48
                        rounded-xl shadow-lg z-50 overflow-hidden
                        bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                        mt-2
                        absolute
                        left-0 md:left-auto
                        right-0
                        top-full
                        pointer-events-auto
                      `}
                    >
                      {dropdownLinks.map((item) => (
                        <li key={item.to} role="menuitem">
                          <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm transition-colors ${
                                item.isRed
                                  ? "text-red-500 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/10"
                                  : "text-gray-600 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-600/50"
                              } ${
                                isActive && !item.isRed
                                  ? "text-green-700 bg-green-50/80 dark:bg-green-900/20 dark:text-green-400"
                                  : ""
                              }`
                            }
                          >
                            {item.text}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `h-11 flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? "text-green-700 bg-green-50/80 dark:bg-green-900/20 dark:text-green-400"
                            : "text-gray-600 hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-600/50"
                        }`
                      }
                    >
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        `h-11 flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? "bg-green-600/20 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : " text-gray-600 hover:bg-green-600/20 border dark:border-gray-300/60 dark:text-gray-300"
                        }`
                      }
                    >
                      Signup
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="h-[88px]"></div>
    </div>
  );
};

export default Navbar;

