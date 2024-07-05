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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Router } from '@mui/icons-material';

export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const [active, setActive] = React.useState(0);

  const ref = React.useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
//   const pages = ["Home", "Profile", "Add", "Map", "Settings"];



  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200}} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction onClick={() => navigate('/')} className={location.pathname === '/' ? 'Mui-selected' : ''} label="Home" sx={{ color: '#353535'}} icon={<HomeIcon />} />
          <BottomNavigationAction onClick={() => navigate('/Profile')} className={location.pathname === '/Profile' ? 'Mui-selected' : ''} label="Profile" sx={{ color: '#353535'}} icon={<PersonIcon />} />
          <BottomNavigationAction onClick={() => navigate('/addWall')} label="Add" sx={{ color: '#353535'}} className={location.pathname === '/addWall' ? 'Mui-selected' : ''} icon={<AddCircleIcon />} />
          <BottomNavigationAction onClick={() => navigate('/Map')} label="Map" sx={{ color: '#353535'}} className={location.pathname === '/Map' ? 'Mui-selected' : ''}icon={<LocationOnIcon />} />
          <BottomNavigationAction onClick={() => navigate('/ProfileSettings')} label="Settings" sx={{ color: '#353535'}} className={location.pathname === '/ProfileSettings' ? 'Mui-selected' : ''} icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

