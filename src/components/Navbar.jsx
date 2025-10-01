import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { ArtZoroLogoWhite } from '@assets';
import { navLinks, navDropdowns } from "@constants";
import NavDropdown from "./NavDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";
import AuthService from '@services/AuthService';
import NotificationPanel from "./NotificationPanel";
import { addNotification } from '@store/slices/uiSlice';
import { logoutUser } from '@store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState("Home");
  const [toggle_menu, setToggle_menu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const menuRef = useRef();

  const isAuthenticated = AuthService.isAuthenticated();

  const getUser = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };

  const user = isAuthenticated ? getUser() : null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Dispatch Redux logout action
      dispatch(logoutUser());
      
      dispatch(addNotification({
        type: 'success',
        message: 'Successfully logged out!',
        duration: 3000
      }));
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      
      // Clear localStorage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logoutUser());
      
      dispatch(addNotification({
        type: 'error',
        message: 'Error logging out. Please try again.',
        duration: 3000
      }));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      dispatch(addNotification({
        type: 'info',
        message: `Searching for "${searchQuery}"...`,
        duration: 2000
      }));
      setSearchExpanded(false);
      setSearchQuery("");
    }
  };



  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setToggle_menu(false);
        setSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);


  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-[200] bg-indigo-600 backdrop-blur-md shadow-xl">
      <div className="max-w-7xl mx-auto flex py-3 px-4 sm:px-6 items-center justify-between">
        {/* Left Side - Logo */}
        <div className="flex items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center hover:scale-105 transition-transform duration-300 group">
          <div className="relative">
            <img
              src={ArtZoroLogoWhite}
              alt="MuralFinder"
              className="w-[35px] h-[32px] sm:w-[45px] sm:h-[40px] object-contain transition-transform duration-300 group-hover:rotate-12"
            />
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </div>
        </Link>
        </div>

        {/* Center Navigation */}
        <div className="lg:flex hidden items-center space-x-2 xl:space-x-4">
          {/* Main Navigation Links */}
          <ul className="list-none flex items-center space-x-4 xl:space-x-6">
            {navLinks.filter(nav => nav.title !== 'LOGIN').map((nav) => (
              <li key={nav.id} className="relative group">
                <Link
                  to={nav.id === 'home' ? '/' : `/${nav.id}`}
                  className={`font-raleway font-medium text-[14px] xl:text-[15px] transition-all duration-300 hover:text-white relative py-2 px-1 ${
                    active === nav.title ? "text-white" : "text-dimWhite"
                  }`}
                  onClick={() => setActive(nav.title)}
                >
                  {nav.title}
                  {/* Active indicator */}
                  <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ${
                    active === nav.title ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>

                  {/* Hover background */}
                  <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Navigation Dropdowns */}
          <div className="flex items-center space-x-2">
            {navDropdowns.map((dropdown) => (
              <NavDropdown
                key={dropdown.id}
                title={dropdown.title}
                items={dropdown.items}
                isActive={active === dropdown.title}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Search & User Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Search */}
        <div className="flex items-center">
          {searchExpanded ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 min-w-[200px] sm:min-w-[280px] animate-slide-in-right">
                <MdOutlineSearch className="text-white/70 text-base sm:text-lg mr-2 sm:mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artworks, artists..."
                  className="bg-transparent text-white placeholder-white/50 outline-none flex-1 text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchExpanded(false);
                    setSearchQuery("");
                  }}
                  className="text-white/50 hover:text-white ml-2 text-lg transition-colors duration-200 flex-shrink-0 hover:bg-white/10 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setSearchExpanded(true)}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 group relative"
              title="Search"
            >
              <MdOutlineSearch className="text-white/70 group-hover:text-white text-base sm:text-lg transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
            </button>
          )}
        </div>

        {/* User Actions */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="hover:scale-110 transition-transform duration-300 hidden sm:block">
              <NotificationPanel />
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown user={user} onLogout={handleLogout} />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/Login"
              className="text-white/70 hover:text-white font-raleway font-medium text-sm transition-all duration-300 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/10 hover:scale-105 relative group"
            >
              Login
              <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
            </Link>
            <Link
              to="/Signup"
              className="bg-blue-gradient text-primary font-raleway font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:scale-105 transition-all duration-300 text-sm shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden flex items-center ml-2" ref={menuRef}>
        {/* Mobile Notifications (for authenticated users) */}
        {isAuthenticated && (
          <div className="mr-2 sm:hidden">
            <NotificationPanel />
          </div>
        )}

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setToggle_menu(!toggle_menu)}
          className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group relative"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ${
              toggle_menu ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
            }`}></div>
            <div className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ${
              toggle_menu ? 'opacity-0' : 'opacity-100'
            }`}></div>
            <div className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ${
              toggle_menu ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
            }`}></div>
          </div>
        </button>

        {/* Mobile Menu Dropdown */}
        {toggle_menu && (
          <div className="fixed inset-0 z-[250] lg:hidden" onClick={() => setToggle_menu(false)}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          </div>
        )}

        <div
          className={`absolute top-full right-0 mt-2 bg-indigo-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-[300] min-w-[280px] transition-all duration-300 ${
            toggle_menu
              ? "opacity-100 visible transform translate-y-0"
              : "opacity-0 invisible transform -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="p-4">
            <ul className="flex flex-col space-y-1 w-full">
              {/* Main Navigation Links */}
              {navLinks.filter(nav => nav.title !== 'LOGIN').map((nav, index) => (
                <li key={nav.id} className="animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <Link
                    to={nav.id === 'home' ? '/' : `/${nav.id}`}
                    className={`block px-3 py-3 rounded-lg font-raleway font-medium text-sm transition-all duration-300 flex items-center space-x-3 ${
                      active === nav.title ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => {
                      setActive(nav.title);
                      setToggle_menu(false);
                    }}
                  >
                    <span>{nav.title}</span>
                    {active === nav.title && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                </li>
              ))}

              {/* Dropdown Items */}
              {navDropdowns.map((dropdown, dropdownIndex) => (
                <li key={dropdown.id} className="animate-slide-in-up" style={{animationDelay: `${(navLinks.length + dropdownIndex) * 0.1}s`}}>
                  <div className="px-3 py-2">
                    <div className="text-xs font-raleway font-semibold text-white/50 uppercase tracking-wider mb-2">
                      {dropdown.title}
                    </div>
                    <div className="space-y-1">
                      {dropdown.items.map((item) => (
                        <Link
                          key={item.id}
                          to={item.link}
                          className="block px-3 py-2 rounded-lg font-raleway font-medium text-sm transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
                          onClick={() => {
                            setActive(item.title);
                            setToggle_menu(false);
                          }}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ))}

              {/* Mobile User Actions */}
              {isAuthenticated ? (
                <li className="pt-3 border-t border-white/10 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                  <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-raleway font-medium text-sm">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-white/50 font-raleway text-xs capitalize">
                        {user?.role || 'Member'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Profile Links */}
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 font-raleway font-medium text-sm transition-all duration-300"
                      onClick={() => setToggle_menu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/ProfileSettings"
                      className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 font-raleway font-medium text-sm transition-all duration-300"
                      onClick={() => setToggle_menu(false)}
                    >
                      Settings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 font-raleway font-medium text-sm transition-all duration-300"
                        onClick={() => setToggle_menu(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setToggle_menu(false);
                      }}
                      disabled={isLoggingOut}
                      className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 font-raleway font-medium text-sm transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                  </div>
                </li>
              ) : (
                <li className="pt-3 border-t border-white/10 space-y-2 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                  <Link
                    to="/Login"
                    className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 font-raleway font-medium text-sm transition-all duration-300"
                    onClick={() => setToggle_menu(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/Signup"
                    className="block px-3 py-2 rounded-lg bg-blue-gradient text-primary font-raleway font-bold text-sm text-center transition-transform duration-300 hover:scale-105 shadow-lg"
                    onClick={() => setToggle_menu(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      </div>


    </nav>
  );
};

export default Navbar;
