import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

const NavDropdown = ({ title, items, icon: Icon, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-raleway font-medium text-sm transition-all duration-300 ${
          isActive 
            ? "text-white bg-white/10" 
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{title}</span>
        {isOpen ? (
          <MdKeyboardArrowUp className="w-4 h-4 transition-transform duration-200" />
        ) : (
          <MdKeyboardArrowDown className="w-4 h-4 transition-transform duration-200" />
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full left-0 mt-2 bg-indigo-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-[300] min-w-[200px] transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible transform translate-y-0"
            : "opacity-0 invisible transform -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-2">
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={item.id} className="animate-slide-in-up" style={{animationDelay: `${index * 0.05}s`}}>
                <Link
                  to={item.link}
                  className="block px-3 py-2 rounded-lg font-raleway font-medium text-sm transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavDropdown;
