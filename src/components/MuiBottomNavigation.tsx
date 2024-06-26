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
import { Link } from 'react-router-dom';
import { Router } from '@mui/icons-material';

export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);

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

