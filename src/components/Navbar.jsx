import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { ArtZoroLogoWhite, close, menu } from '@assets';
import { navLinks } from "@constants";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";
import AuthService from '@services/AuthService';
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./UserAvatar";
import { addNotification } from '@store/slices/uiSlice';
import styles from '@styles';

const Navbar = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [toggle_menu, setToggle_menu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const isAuthenticated = AuthService.isAuthenticated();

  const getUser = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };

  const user = isAuthenticated ? getUser() : null;
  const userImage = user?.profile?.profile_image_url  || 'https://example.com/default-image.jpg';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      dispatch(addNotification({
        type: 'success',
        message: 'Successfully logged out!',
        duration: 3000
      }));
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
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
        setToggle(false);
        setToggle_menu(false);
        setSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // Handle scroll effect for modern navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`w-full flex py-4 px-6 justify-between items-center transition-all duration-300 ${
      isScrolled ? 'bg-indigo-900/95 backdrop-blur-md shadow-xl border-b border-white/10' : 'bg-transparent'
    }`}>

      {/* Left Side - Logo + Navigation */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
          <img
            src={ArtZoroLogoWhite}
            alt="ArtZoro"
            className="w-[45px] h-[40px] object-contain"
          />
          <span className="font-raleway font-bold text-white text-xl hidden sm:block">
            MuralFinder
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="list-none lg:flex hidden items-center space-x-8">
          {navLinks.filter(nav => nav.title !== 'LOGIN').map((nav) => (
            <li key={nav.id}>
              <Link
                to={nav.id === 'home' ? '/' : `${nav.id}`}
                className={`font-raleway font-medium text-[15px] transition-all duration-300 hover:text-white relative ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                }`}
                onClick={() => setActive(nav.title)}
              >
                {nav.title}
                {active === nav.title && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side - Search & User Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:flex items-center">
          {searchExpanded ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 min-w-[280px]">
                <MdOutlineSearch className="text-white/70 text-lg mr-3" />
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
                  className="text-white/50 hover:text-white ml-2 text-lg transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setSearchExpanded(true)}
              className="p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              title="Search"
            >
              <MdOutlineSearch className="text-white/70 group-hover:text-white text-lg transition-colors duration-300" />
            </button>
          )}
        </div>

        {/* User Actions */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="hover:scale-110 transition-transform duration-300">
              <NotificationPanel />
            </div>

            {/* User Avatar */}
            <div className="hover:scale-105 transition-transform duration-300">
              <UserAvatar />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
            >
              <span className="text-sm font-medium">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/Login"
              className="text-white/70 hover:text-white font-raleway font-medium text-sm transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/Signup"
              className="bg-blue-gradient text-primary font-raleway font-bold px-4 py-2.5 rounded-lg hover:scale-105 transition-transform duration-300 text-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden flex items-center ml-4" ref={menuRef}>
        <button
          onClick={() => setToggle_menu(!toggle_menu)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
        >
          <img
            src={toggle_menu ? close : menu}
            alt="menu"
            className="w-[24px] h-[24px] object-contain"
          />
        </button>

        {/* Mobile Menu Dropdown */}
        <div
          className={`${!toggle_menu ? "hidden" : "flex"
            } absolute top-full right-6 mt-2 p-4 bg-indigo-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-[100] min-w-[200px]`}
        >
          <ul className="flex flex-col space-y-3 w-full">
            {navLinks.filter(nav => nav.title !== 'LOGIN').map((nav) => (
              <li key={nav.id}>
                <Link
                  to={nav.id === 'home' ? '/' : `${nav.id}`}
                  className={`block px-3 py-2 rounded-lg font-raleway font-medium text-sm transition-all duration-300 ${
                    active === nav.title ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => {
                    setActive(nav.title);
                    setToggle_menu(false);
                  }}
                >
                  {nav.title}
                </Link>
              </li>
            ))}

            {/* Mobile User Actions */}
            {isAuthenticated ? (
              <li className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    handleLogout();
                    setToggle_menu(false);
                  }}
                  disabled={isLoggingOut}
                  className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 font-raleway font-medium text-sm transition-all duration-300"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </li>
            ) : (
              <li className="pt-2 border-t border-white/10 space-y-2">
                <Link
                  to="/Login"
                  className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 font-raleway font-medium text-sm transition-all duration-300"
                  onClick={() => setToggle_menu(false)}
                >
                  Login
                </Link>
                <Link
                  to="/Signup"
                  className="block px-3 py-2 rounded-lg bg-blue-gradient text-primary font-raleway font-bold text-sm text-center transition-transform duration-300 hover:scale-105"
                  onClick={() => setToggle_menu(false)}
                >
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>


    </nav>
  );
};

export default Navbar;
