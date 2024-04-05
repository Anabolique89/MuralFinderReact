import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles, { layout } from '../style';
import { fadeintoyouWhite } from '../assets';
import AuthService from '../services/AuthService';

const Indexlogin = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const { user, token } = await AuthService.login(email, password);

        sessionStorage.clear();
        sessionStorage.setItem('user', user);
        sessionStorage.setItem('token', token);
        console.log("Login was succesful");
        console.log(user);

        navigate('/Profile'); // please change this to redirect to the right place..
      } catch (error) {
        // Handle error if login fails
        if (error.message) {
          console.log(error)
          // can do specifi email/username validation here
          setEmailError(error.message);
        } else {
          // Handle other types of errors
          setEmailError('Login Failed');
        }
      }
    }
  };

  const validate = () => {
    let result = true;

    if (email === '' || email === null) {
      result = false;
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }

    if (password === '' || password === null) {
      result = false;
      setPasswordError('Please enter your password');
    } else {
      setPasswordError('');
    }

    return result;
  };

  return (
    <div className={`${layout.sectionImg} bg-indigo-700 mt-0`}>
      <form className="login-form absolute z-[5] backdrop-filter backdrop-blur-lg p-4 md:p-8 sm:p-10 ss:p-34 rounded-2xl border-solid border-2 border-indigo-600" onSubmit={handleLogin}>
        <h1 className='font-raleway font-semibold ss:text-[30px] text-[35px] text-white ss:leading-[40px] leading-[45px] w-full p-2'>Enter Your Account.</h1>
        {emailError && <span className="error-message mt-2 text-red-500">{emailError}</span>}
        {passwordError && <span className="error-message mt-2 text-red-500">{passwordError}</span>}
        <div className="form-group flex flex-col">
          <div className="input-wrapper mb-4">
            <input
              type="text"
              name="email"
              placeholder="Username or Email"
              className={`input-text ${emailError ? 'input-error' : ''} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`input-text ${passwordError ? 'input-error' : ''} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className={`${styles.flexCenter} p-4`}>
          <button type="submit" className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full ${styles}`}>Login</button>
          <Link className="btn btn-success" to={'/IndexSignup'}>New User</Link>
        </div>
        <p className={`${styles.paragraph} text-indigo-600`}>Don't have an account? <a className={`${styles.paragraph} text-black`} href='/IndexSignup'>Register Here</a></p>
      </form>
      <div className={layout.sectionImg}>
        <img className='w-[80%] h-auto relative z-[2] w-[100%] p-2 md:px-20 sm:px-26 ss:px-34' src={fadeintoyouWhite} alt="swim" />
      </div>
    </div>
  );
};

export default Indexlogin;