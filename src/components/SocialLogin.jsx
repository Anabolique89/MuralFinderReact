import { useNavigate } from 'react-router-dom';
import { Facebook, Google } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState } from 'react';

const SocialLogin = () => {
    const navigate = useNavigate();
    const [loginAttempted, setLoginAttempted] = useState(false);
    const [loginError, setLoginError] = useState(null); // State to store login errors

    const handleLogin = async (provider) => {
        setLoginAttempted(true);
        setLoginError(null); // Clear previous errors

        try {
            const response = await fetch(`http://localhost:8000/api/auth/${provider}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                navigate('/'); // Redirect to home on success
            } else {
                console.error('Login failed:', data.message);
                setLoginError(data.message); // Set error message to display
            }
        } catch (error) {
            console.error('Error during social login:', error);
            setLoginError(error.message || 'An unknown error occurred.'); // Set error message to display
        } finally {
            setLoginAttempted(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-4">
            {loginError && <p className="text-red-500">{loginError}</p>} {/* Display error if any */}

            <Button
                variant="contained"
                color="error"
                className="w-full"
                startIcon={<Google />}
                onClick={() => handleLogin('google')}
                sx={{ borderRadius: '50%' }}
                disabled={loginAttempted} // Disable button during login attempt
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
                disabled={loginAttempted} // Disable button during login attempt
            >
                Login with Facebook
            </Button>
        </div>
    );
};

export default SocialLogin;
