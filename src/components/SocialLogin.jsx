import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Facebook, Google } from '@mui/icons-material';

const SocialLogin = () => {
    const [loginError, setLoginError] = useState(null);
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
       const handleMessage = (event) => {
    if (event.data && event.data.type === 'redirect') {
        const url = new URL(event.data.url);
        const token = url.searchParams.get('token');
        const user = JSON.parse(url.searchParams.get('user'));
        const error = url.searchParams.get('error');

        if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            window.close(); // Close the new tab
        } else if (error) {
            setLoginError(error);
        }
    }
};
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
        if (responseData) {
            localStorage.setItem('token', responseData.token);
            localStorage.setItem('user', JSON.stringify(responseData.user));
            window.close(); // Close the new tab
        }
    }, [responseData]);

    const apiUrl = process.env.REACT_APP_API_URL;

    const handleLogin = (provider) => {
        const newTab = window.open(`${apiUrl}${provider}`, '_blank');
        if (newTab) {
            newTab.focus();
        } else {
            setLoginError('Popup blocked. Please allow popups for this site.');
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-4">
            {loginError && <p className="text-red-500">{loginError}</p>}

            <Button
                variant="contained"
                color="error"
                className="w-full"
                startIcon={<Google />}
                onClick={() => handleLogin('google')}
                sx={{ borderRadius: '50%' }}
            >
                Login with Google
            </Button>
            <Button
                variant="contained"
                color="primary"
                className="w-full"
                startIcon={<Facebook />}
                onClick={() => handleLogin('facebook')}
                sx={{ borderRadius: '50%' }}
            >
                Login with Facebook
            </Button>
        </div>
    );
};

export default SocialLogin;
