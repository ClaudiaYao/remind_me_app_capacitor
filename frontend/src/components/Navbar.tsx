import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Menu, X, ChevronDown } from "lucide-react";
import JobStatusBanner from "./JobStatusBanner";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { userProfile } = useUserProfile();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (): void => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = (): void => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <nav className="bg-gray-700 shadow-lg fixed w-full top-0 left-0 z-50 py-1 rounded-b-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <img src={"/remind-svgrepo-com.svg"} alt="remindMe" className="h-10 w-15 rounded-full object-cover" />
            <span>
              <Link to="/" className="!text-white font-bold text-3xl">
                RemindMe{" "}
              </Link>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block ">
            <div className="mr-30 flex items-center space-x-4">
              <NavLink
                to="/"
                className={({ isActive }: { isActive: boolean }) =>
                  isActive
                    ? "bg-gray-900 text-white px-3 py-2 rounded-md text-lg font-medium"
                    : "text-white hover:text-white px-3 py-2 rounded-md text-lg font-medium"
                }
              >
                Home
              </NavLink>
              {/* <NavLink 
                to="/about" 
                className={({ isActive }: { isActive: boolean }) => 
                  isActive 
                    ? "bg-gray-900 text-white px-3 py-2 rounded-md text-lg font-medium" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-lg font-medium"
                }
              >
                About
              </NavLink> */}
              <NavLink
                to="/identify"
                className={({ isActive }: { isActive: boolean }) =>
                  isActive
                    ? "bg-gray-900 text-white px-3 py-2 rounded-md text-lg font-medium"
                    : "text-white hover:text-white px-3 py-2 rounded-md text-lg font-medium"
                }
              >
                Identify
              </NavLink>
              <NavLink
                to="/train"
                onClick={() => setIsOpen(false)}
                className={({ isActive }: { isActive: boolean }) =>
                  isActive
                    ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                }
              >
                Train AI Assistant
              </NavLink>
              <NavLink
                to="/upload"
                className={({ isActive }: { isActive: boolean }) =>
                  isActive
                    ? "bg-gray-900 text-white px-3 py-2 rounded-md text-lg font-medium"
                    : "text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-lg font-medium"
                }
              >
                Upload
              </NavLink>
              <NavLink
                to="/instruction"
                className={({ isActive }: { isActive: boolean }) =>
                  isActive
                    ? "bg-gray-900 text-white px-3 py-2 rounded-md text-lg font-medium"
                    : "text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-lg font-medium"
                }
              >
                Instruction
              </NavLink>
            </div>
          </div>

          {/* User Profile or Login */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-300 hover:text-white cursor-pointer"
                >
                  <img
                    src={userProfile?.avatar_url || "/profile.png"}
                    alt="Profile"
                    className="h-14 w-14 rounded-full object-cover border-2 border-gray-600"
                  />
                  <ChevronDown size={16} className="ml-1" />
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-500 rounded-md shadow-lg py-3 z-10">
                    <NavLink
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/instruction"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                    >
                      Instruction
                    </NavLink>
                    <NavLink
                      to="/about"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                    >
                      About Us
                    </NavLink>
                    <NavLink
                      onClick={handleLogout}
                      to="/"
                      className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </NavLink>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-lg font-medium"
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                isActive
                  ? "bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                  : "text-gray-50 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/identify"
              onClick={() => setIsOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                isActive
                  ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              }
            >
              Identify
            </NavLink>
            <NavLink
              to="/train"
              onClick={() => setIsOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                isActive
                  ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              }
            >
              Train AI Assistant
            </NavLink>

            <NavLink
              to="/upload"
              onClick={() => setIsOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                isActive
                  ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              }
            >
              Upload
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:bg-gray-100 hover:text-white block px-3 py-2 rounded-md text-lg font-medium text-center"
                >
                  <div className="flex items-center justify-center">
                    <img
                      src={userProfile?.avatar_url || "/profile.png"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    My Profile
                  </div>
                </NavLink>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="text-center w-full text-gray-300 hover:bg-gray-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </NavLink>
            )}

            <NavLink
              to="/instruction"
              onClick={() => setIsOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                isActive
                  ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              }
            >
              Instruction
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setIsOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                isActive
                  ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              }
            >
              About
            </NavLink>
          </div>
        </div>
      )}
      <JobStatusBanner />
    </nav>
  );
};

export default Navbar;
