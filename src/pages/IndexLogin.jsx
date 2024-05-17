import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles, { layout } from '../style';
import { fadeintoyouWhite } from '../assets';
import AuthService from '../services/AuthService';
import { Footer } from '../components';
import SocialLogin from '../components/SocialLogin';

const Indexlogin = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    if (validate()) {
      try {
        const { user, token } = await AuthService.login(email, password);

        sessionStorage.clear();
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        console.log("Login was successful");
        console.log(user);

        navigate('/Profile'); // please change this to redirect to the right place..
        
      } catch (error) {
        // Handle error if login fails
        if (error.message) {
          console.log(error)
          // can do specific email/username validation here
          setEmailError(error.message);
        } else {
          // Handle other types of errors
          setEmailError('Login Failed');
        }
      } finally {
        setIsLoading(false); // Reset loading state
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
    <section>
      <div className={`${layout.sectionImg} bg-indigo-700 mt-0 w-full`}>
        <form className="login-form absolute z-[5] backdrop-filter backdrop-blur-lg p-4 md:p-8 sm:p-10 ss:p-30 rounded-2xl border-solid border-2 border-indigo-600 sm:mt-10 sm:mb-10" onSubmit={handleLogin}>
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
            <button type="submit" disabled={isLoading} className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full ${styles}`}>
              {isLoading ? <div className="loader"></div> : 'Login'}
            </button>
          </div>
          <SocialLogin />
          <p className={`font-raleway font-normal text-[18px] leading-[30.8px] text-black`}>Don't have an account? <Link className={`font-raleway font-normal text-[18px] leading-[30.8px] text-black hover:text-blue-800 underline`} to='/IndexSignup'> Register Here</Link></p>
        </form>
        <div className={layout.sectionImg}>
          <img className='w-[80%] h-auto relative z-[2] w-[100%] p-2 md:px-20 sm:px-26 ss:px-34' src={fadeintoyouWhite} alt="swim" />
        </div>
      </div>
      <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
        <Footer />
      </div>
    </section>
  );
};

export default Indexlogin;
