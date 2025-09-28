import React from 'react';
import { useMediaQuery } from '@mui/material';
import MobileFooter from './MobileFooter';
import WebFooter from './WebFooter';
import FixedBottomNavigation from './MuiBottomNavigation';


const Footer = () => {
    const isMobile = useMediaQuery('(max-width:768px)');

    return isMobile ? <FixedBottomNavigation /> : <WebFooter />;
};

export default Footer;
