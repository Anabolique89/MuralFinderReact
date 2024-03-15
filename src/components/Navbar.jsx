import { useState } from "react";
import { close, ArtZoroLogoWhite, menu, profile } from "../assets";
import { navLinks, navLinks2 } from "../constants";
import { Link } from "react-router-dom";


const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  

  return (
    <nav className="w-full flex py-6 justify-between items-center Navbar pb-0">
      <img src={ArtZoroLogoWhite} alt="ArtZoroLogoWhite" className="w-[120px] h-[60px]" />

      <ul className="list-none sm:flex hidden flex justify-center items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-roboto font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <Link to={nav.id ==='home' ? '/': `${nav.id}`}>{nav.title}</Link>
          </li>
        ))}
      </ul>
      {/* the username & Logout */}
      <ul className="list-none sm:flex hidden flex justify-end items-center flex-1">
        {navLinks2.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-roboto font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navLinks2.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <Link to={`${nav.id}`}>{nav.title}</Link>
          </li>
        ))}
      </ul>

      <div className='flex flex-row items-center py-[6px] px-2 rounded-[30px] mb-2 ms-8'>
<img src={profile} alt="profile" className="w-[30px] h-[30px]" /> PROFILE
      </div>
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <Link to={`#${nav.id}`}>{nav.title}</Link>

              </li>
              
            ))}
          </ul>
        
        </div>

      </div>
    </nav>
  );
};

export default Navbar;