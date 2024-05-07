import { useState } from "react";
import { ArtZoroLogoWhite, close, menu } from "../assets";
import { navLinks } from "../constants";
import { Link } from "react-router-dom";
import { faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthService from "../services/AuthService";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [toggle_menu, setToggle_menu] = useState(false);

  const isAuthenticated = AuthService.isAuthenticated();

  const getUser = () => {
    const userString = sessionStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };
  
  const user = isAuthenticated ? getUser() : null;
  

  return (
    <nav className="w-full flex py-6 justify-between items-center Navbar pb-0">

      <ul className="list-none sm:flex hidden flex justify-left items-left flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-roboto font-normal cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-dimWhite"
              } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            {nav.title === 'LOGIN' && isAuthenticated ? (
              <Link to="/logout" className="text-gray-200 hover:text-red-700">LOGOUT</Link>
            ) : (
              <Link to={nav.id === 'home' ? '/' : `${nav.id}`}>{nav.title}</Link>
            )}
          </li>
        ))}
      </ul>

    
           

      <div className="sm:hidden flex flex-1 justify-start items-left">
        <img
          src={toggle_menu ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle_menu(!toggle_menu)}
        />

        <div
          className={`${!toggle_menu ? "hidden" : "flex"
            } p-6 bg-black-gradient absolute top-20 left-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar z-[99]`}
        >
         
          <ul className="list-none flex justify-start items-centre flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-roboto font-medium cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-dimWhite"
                  } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <Link to={`#${nav.id}`}>{nav.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {isAuthenticated && (
        <div className="flex flex-row items-center py-[6px] px-2 rounded-[30px] mb-2 ms-8">
          <div className="flex items-center">
            <div className="w-[35px] h-[35px] flex items-center justify-center rounded-full">
            <img src={ArtZoroLogoWhite} alt="ArtZoroLogoWhite" className="w-[120px] h-[60px]" />
              {/* <FontAwesomeIcon icon={faUser} alt="User Icon" className="w-[20px] h-[20px] text-white p-3" /> */}
            </div>

            <div className="relative">
              <Link to="/profile" className="text-white ml-2">{user.username}</Link>
              <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-white cursor-pointer" onClick={() => setToggle(!toggle)} />
              {toggle && (
                <div className="absolute top-10 right-0 bg-indigo-800 text-white p-4 rounded-md shadow-md">
                  <Link to="/profile" className="block text-gray-200 hover:text-gray-600">Profile</Link>
                  <Link to="/logout" className="block text-gray-200 hover:text-gray-600 mt-2">Logout</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      
      )}
    </nav>
  );
};

export default Navbar;
