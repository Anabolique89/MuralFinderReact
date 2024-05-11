import React, {useState} from 'react';
import styles, { layout } from '../style';
import { Menus } from '../constants';


const BottomNavigation = () => {
    
      const [active, setActive] = useState(0);
      return (
        <div className="cta-block max-h-[4.4rem] px-6 rounded-t-xl">
            <ul className="flex relative">
                <span
                    className={`cta-block duration-500 ${Menus[active].dis} border-4 border-white h-16 w-16 absolute -top-5 rounded-full`}
                >
                    <span className="w-3.5 h-3.5 bg-transparent absolute top-4 -left-[18px] rounded-tr-[11px] shadow-myShadow1"></span>
                    <span className="w-3.5 h-3.5 bg-transparent absolute top-4 -right-[18px] rounded-tl-[11px] shadow-myShadow2"></span>
                </span>
                {Menus.map((menu, i) => (
                    <li key={i} className="w-16">
                        <a
                            href={menu.link}
                            className="flex flex-col text-center pt-6 text-white font-raleway"
                            onClick={() => handleClick(i, menu.link)}
                        >
                            <span
                                className={`text-xl cursor-pointer duration-500 ${
                                    i === active && "-mt-6 text-white"
                                }`}
                            >
                                <ion-icon name={menu.icon}></ion-icon>
                            </span>
                            <span
                                className={` ${
                                    active === i
                                        ? "translate-y-4 duration-700 opacity-100"
                                        : "opacity-0 translate-y-10"
                                } `}
                            >
                                {menu.name}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BottomNavigation