import { useState, useEffect, useRef } from "react";
import { ArtZoroLogoWhite, close, menu } from "../assets";
import { navLinks } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";
import AuthService from "../services/AuthService";
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [toggle_menu, setToggle_menu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
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
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setToggle(false);
        setToggle_menu(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

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
              <Link to="/login" className="text-gray-200 hover:text-red-700" onClick={handleLogout}>
                {isLoggingOut ? 'Logging out...' : 'LOGOUT'}
              </Link>
            ) : (
              <Link to={nav.id === 'home' ? '/' : `${nav.id}`}>{nav.title}</Link>
            )}
          </li>
        ))}
      </ul>

      <div className="sm:hidden flex flex-1 justify-start items-left" ref={menuRef}>
        <img
          src={toggle_menu ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle_menu(!toggle_menu)}
        />

        <div 
          className={`${!toggle_menu ? "hidden" : "flex"
            } p-6  cta-block absolute top-20 left-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar z-[100]`}
        >
          <ul className="list-none flex justify-start items-centre flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-roboto font-medium cursor-pointer text-[16px] ${active === nav.title ? "text-pink-600" : "text-white"
                  } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                {nav.title === 'LOGIN' && isAuthenticated ? (
                  <Link to="/login" className="text-gray-200 hover:text-red-700" onClick={handleLogout}>
                    {isLoggingOut ? 'Logging out...' : 'LOGOUT'}
                  </Link>
                ) : (
                  <Link to={`${nav.link}`}>{nav.title}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isAuthenticated && (
        <div className="flex flex-row items-center py-[6px] px-2 rounded-[30px] mb-2 ms-8">
          <div className="flex items-center">
            <div className="w-[35px] h-[35px] flex items-center justify-center rounded-full">
              <a href="/">
              <img src={ArtZoroLogoWhite} alt="ArtZoroLogoWhite" className="w-[120px] h-[60px]" />
              </a>
            </div>
            {/* Search Bar */}
            <div className={`w-[170px] 2xl:w-[200px] max-w-[100%] flex items-center gap-2 rounded-full bg-[#f3f4f6] ml-1 mr-1 ${searchExpanded ? 'search-bar-expanded' : 'hide-on-small'}`}>
              <MdOutlineSearch className='text-gray-500 text-xl' onClick={() => setSearchExpanded(!searchExpanded)} />
              <input
                type='text'
                placeholder='Search....'
                className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800'
              />
            </div>
            {!searchExpanded && (
              <div className="search-icon" onClick={() => setSearchExpanded(true)}>
                <MdOutlineSearch className="text-white text-2xl" />
              </div>
            )}
            {/* Notifications */}
            <div className='flex gap-2 items-center'>
              <NotificationPanel />
            </div>

            
            <UserAvatar />
            {/* <div className="relative font-medium font-roboto">
              <Link to="/profile">
                <div className="w-[35px] h-[35px] rounded-full bg-gray-200 overflow-hidden">
                  <img src={userImage} alt="User Avatar" className="w-full h-full object-cover" />
                </div>
              </Link>
              
            </div> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


// import { useState, useEffect, useRef } from "react";
// import { ArtZoroLogoWhite, close, menu } from "../assets";
// import { navLinks } from "../constants";
// import { Link, useNavigate } from "react-router-dom";
// import { faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import AuthService from "../services/AuthService";
// import NotificationPanel from "./NotificationPanel";
// import { MdOutlineSearch } from "react-icons/md";

// const Navbar = () => {
//   const [active, setActive] = useState("Home");
//   const [toggle, setToggle] = useState(false);
//   const [toggle_menu, setToggle_menu] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const navigate = useNavigate();
//   const menuRef = useRef();

//   const isAuthenticated = AuthService.isAuthenticated();

//   const getUser = () => {
//     const userString = localStorage.getItem('user');
//     return userString ? JSON.parse(userString) : null;
//   };

//   const user = isAuthenticated ? getUser() : null;

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     try {
//       await AuthService.logout();
//       navigate('/login');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   useEffect(() => {
//     const handler = (e) => {
//       if (!menuRef.current.contains(e.target)) {
//         setToggle(false);
//         setToggle_menu(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);

//     return () => {
//       document.removeEventListener("mousedown", handler);
//     };
//   }, []);

//   return (
//     <nav className="w-full flex py-6 justify-between items-center Navbar pb-0">
//       <ul className="list-none sm:flex hidden flex justify-left items-left flex-1">
//         {navLinks.map((nav, index) => (
//           <li
//             key={nav.id}
//             className={`font-roboto font-normal cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-dimWhite"
//               } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
//             onClick={() => setActive(nav.title)}
//           >
//             {nav.title === 'LOGIN' && isAuthenticated ? (
//               <Link to="/login" className="text-gray-200 hover:text-red-700" onClick={handleLogout}>
//                 {isLoggingOut ? 'Logging out...' : 'LOGOUT'}
//               </Link>
//             ) : (
//               <Link to={nav.id === 'home' ? '/' : `${nav.id}`}>{nav.title}</Link>
//             )}
//           </li>
//         ))}
//       </ul>

//       <div className="sm:hidden flex flex-1 justify-start items-left" ref={menuRef}>
//         <img
//           src={toggle_menu ? close : menu}
//           alt="menu"
//           className="w-[28px] h-[28px] object-contain"
//           onClick={() => setToggle_menu(!toggle_menu)}
//         />

//         <div 
//           className={`${!toggle_menu ? "hidden" : "flex"
//             } p-6  cta-block absolute top-20 left-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar z-[100]`}
//         >
//           <ul className="list-none flex justify-start items-centre flex-1 flex-col">
//             {navLinks.map((nav, index) => (
//               <li
//                 key={nav.id}
//                 className={`font-roboto font-medium cursor-pointer text-[16px] ${active === nav.title ? "text-pink-600" : "text-white"
//                   } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
//                 onClick={() => setActive(nav.title)}
//               >
//                 <Link to={`${nav.link}`}>{nav.title}</Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {isAuthenticated && (
//         <div className="flex flex-row items-center py-[6px] px-2 rounded-[30px] mb-2 ms-8">
//           <div className="flex items-center">
//             <div className="w-[35px] h-[35px] flex items-center justify-center rounded-full">
//               <img src={ArtZoroLogoWhite} alt="ArtZoroLogoWhite" className="w-[120px] h-[60px]" />
//             </div>
//             {/* Search Bar */}
//             <div className='w-[100px] 2xl:w-[200px] max-w-[100%] flex items-center gap-2 rounded-full bg-[#f3f4f6] hide-on-small'>
//               <MdOutlineSearch className='text-gray-500 text-xl' />
//               <input
//                 type='text'
//                 placeholder='Search....'
//                 className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800'
//               />
//             </div>
//             {/* Notifications */}
//             <div className='flex gap-2 items-center'>
//               <NotificationPanel />
//             </div>

//             <div className="relative font-medium font-roboto">
//               <Link to="/profile" className="text-white ml-2">{user.username}</Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
