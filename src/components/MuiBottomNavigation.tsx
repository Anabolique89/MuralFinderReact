import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SettingsIcon from '@mui/icons-material/Settings';
import ImageIcon from '@mui/icons-material/Image';
import PushPinIcon from '@mui/icons-material/PushPin';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    switch (location.pathname) {
      case '/':
        setValue(0);
        break;
      case '/Profile':
        setValue(1);
        break;
      case '/addWall':
        setValue(2);
        break;
      case '/Map':
        setValue(3);
        break;
      case '/ProfileSettings':
        setValue(4);
        break;
      default:
        setValue(0);
    }
  }, [location.pathname]);

  const handleNavigation = (newValue, path) => {
    setValue(newValue);
    navigate(path);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box sx={{ pb: 7 }}>
     
        <CssBaseline />
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
          >
            <BottomNavigationAction
              onClick={() => handleNavigation(0, '/')}
              label="Home"
              sx={{
                color: value === 0 ? 'primary.main' : '#353535',
                transform: value === 0 ? 'scale(1.2)' : 'scale(1)'
              }}
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              onClick={() => handleNavigation(1, '/Profile')}
              label="Profile"
              sx={{
                color: value === 1 ? 'primary.main' : '#353535',
                transform: value === 1 ? 'scale(1.2)' : 'scale(1)'
              }}
              icon={<PersonIcon />}
            />
            <BottomNavigationAction
              onClick={handleOpen}
              label="Add"
              sx={{
                color: value === 2 ? 'primary.main' : '#353535',
                transform: value === 2 ? 'scale(1.2)' : 'scale(1)'
              }}
              icon={<AddCircleIcon />}
            />
            <BottomNavigationAction
              onClick={() => handleNavigation(3, '/Map')}
              label="Map"
              sx={{
                color: value === 3 ? 'primary.main' : '#353535',
                transform: value === 3 ? 'scale(1.2)' : 'scale(1)'
              }}
              icon={<LocationOnIcon />}
            />
            <BottomNavigationAction
              onClick={() => handleNavigation(4, '/ProfileSettings')}
              label="Settings"
              sx={{
                color: value === 4 ? 'primary.main' : '#353535',
                transform: value === 4 ? 'scale(1.2)' : 'scale(1)'
              }}
              icon={<SettingsIcon />}
            />
          </BottomNavigation>
        </Paper>
      </Box>
      <Modal open={open} onClose={handleClose} aria-labelledby="add-options-modal" aria-describedby="choose-an-option-to-add" sx={{backgroundColor:'transparent'}}>
      <Box sx={{
          position: 'absolute',
          bottom: '55px', // Adjust the position above the navigation bar
          left: '50%',
          transform: 'translateX(-50%)',
          width: 350,
          backgroundColor: 'white',
          display: 'flex',
          p:2,
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <Box onClick={() => { navigate('/add/artwork'); handleClose(); }} sx={{ cursor: 'pointer', textAlign: 'center' }}>
            <ImageIcon sx={{ fontSize: 40, backgroundColor: 'black', color: 'white', borderRadius: '50%', padding: '8px' }} />
            <Typography sx={{ color: '#fc7bde', fontSize: 12 }}>+ ADD ARTWORK</Typography>
          </Box>
          <Box onClick={() => { navigate('/addWall'); handleClose(); }} sx={{ cursor: 'pointer', textAlign: 'center' }}>
            <PushPinIcon sx={{ fontSize: 40, backgroundColor: 'black', color: 'white', borderRadius: '50%', padding: '8px' }} />
            <Typography sx={{ color: '#fc7bde', fontSize: 12 }}>+ ADD WALL</Typography>
          </Box>
          <Box onClick={() => { navigate('/blog/create'); handleClose(); }} sx={{ cursor: 'pointer', textAlign: 'center' }}>
            <PostAddIcon sx={{ fontSize: 40, backgroundColor: 'black', color: 'white', borderRadius: '50%', padding: '8px' }} />
            <Typography sx={{ color: '#fc7bde', fontSize: 12 }}>+ ADD POST</Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
