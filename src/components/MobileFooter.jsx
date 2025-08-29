import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SettingsIcon from '@mui/icons-material/Settings';

// const MobileFooter = () => {

const FixedBottomNavigation = () => {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);


  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" sx={{ color: '#353535'}} icon={<HomeIcon />} />
          <BottomNavigationAction label="Profile" sx={{ color: '#353535'}} icon={<PersonIcon />} />
          <BottomNavigationAction label="Add" sx={{ color: '#353535'}} icon={<AddCircleIcon />} />
          <BottomNavigationAction label="Map" sx={{ color: '#353535'}} icon={<LocationOnIcon />} />
          <BottomNavigationAction label="Settings" sx={{ color: '#353535'}} icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

 
//     const [active, setActive] = useState(0);

//     const handleClick = (index, link) => {
//         setActive(index);
//         // Navigate to the link
//         window.location.href = link;
//     };

//     return (
//         <div className="cta-block max-h-[7rem] px-6 rounded-t-xl fixed bottom-0 left-0 right-0 bg-gray-900 z-50">
//             <ul className="flex relative">
//                 <span
//                     className={`cta-block duration-500 ${Menus[active].dis} border-4 border-white h-16 w-16 absolute -top-4 rounded-full`}
//                 >
//                     <span className="w-3.5 h-3.5 bg-transparent absolute top-4 -left-[18px] rounded-tr-[11px] shadow-myShadow1"></span>
//                     <span className="w-3.5 h-3.5 bg-transparent absolute top-4 -right-[18px] rounded-tl-[11px] shadow-myShadow2"></span>
//                 </span>
//                 {Menus.map((menu, i) => (
//                     <li key={i} className="w-16">
//                         <a
//                             href={menu.link}
//                             className="flex flex-col text-center pt-6 text-white font-raleway"
//                             onClick={() => setActive(i, menu.link)}
//                         >
//                             <span
//                                 className={`text-xl cursor-pointer duration-500 ${
//                                     i === active && "-mt-4 text-white"
//                                 }`}
//                             >
//                                 <ion-icon name={menu.icon}></ion-icon>
//                             </span>
//                             <span
//                                 className={` ${
//                                     active === i
//                                         ? "translate-y-4 duration-700 opacity-100"
//                                         : "opacity-0 translate-y-10"
//                                 } `}
//                             >
//                                 {menu.name}
//                             </span>
//                         </a>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

export default FixedBottomNavigation;
