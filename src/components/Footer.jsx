import React from 'react';
import { useMediaQuery } from '@mui/material';
import MobileFooter from './MobileFooter';
import WebFooter from './WebFooter';


const Footer = () => {
    const isMobile = useMediaQuery('(max-width:600px)');

    return isMobile ? <MobileFooter /> : <WebFooter />;
};

export default Footer;
