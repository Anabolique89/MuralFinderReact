import { useNavigate, useLocation } from 'react-router-dom';
import { Facebook, Google } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

const SocialLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginAttempted, setLoginAttempted] = useState(false);

    const handleLogin = (provider) => {
        setLoginAttempted(true);
        const authUrl = `http://localhost:8000/api/auth/${provider}`;
        window.location.href = authUrl;
    };

    useEffect(() => {
        if (loginAttempted) {
            const searchParams = new URLSearchParams(location.search);
            const token = searchParams.get('token');
            const user = JSON.parse(searchParams.get('user') || null);

            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/');
            } else {
                console.error('No token or user found in callback:', location.search);
            }

            setLoginAttempted(false); // Reset for future login attempts
        }
    }, [location, navigate, loginAttempted]);

    return (
        <div className="flex flex-col items-center gap-4 mt-4">
            <Button
                variant="contained"
                color="error"
                className="w-full"
                startIcon={<Google />}
                onClick={() => handleLogin('google')}
            >
                Login with Google
            </Button>
            <Button
                variant="contained"
                color="primary"
                className="w-full"
                startIcon={<Facebook />}
                onClick={() => console.log("login with facebook")}
            >
                Login with Facebook
            </Button>
        </div>
    );
};

export default SocialLogin;
