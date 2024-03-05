import React, { useState } from 'react';
import styles, { layout } from '../style';
import { libraWhite } from '../assets';

const IndexSignup = () => {
  
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
    repeatPassword: '',
  });


  const [passwordError, setPasswordError] = useState('');

 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name === 'password' || name === 'repeatPassword') {
      setPasswordError('');
    }
  };

 
  const handleSubmit = (event) => {
    event.preventDefault(); 

    
    if (formValues.password !== formValues.repeatPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    console.log('User Details:', formValues);

    
    setTimeout(() => {
      alert(`Signup successful for ${formValues.email}`);
      
      setFormValues({ username: '', email: '', role: '', password: '', repeatPassword: '' }); 
    }, 500);
  };

  return (

    <div className={`${layout.sectionImg} bg-indigo-700 mt-0`} >


    <form className="login-form absolute z-[5] backdrop-filter backdrop-blur-lg p-4 md:p-8 sm:p-10 ss:p-34 rounded-2xl border-solid border-2 border-indigo-600" onSubmit={handleSubmit}>
    <h1 className='font-raleway font-semibold ss:text-[30px] text-[35px] text-white ss:leading-[40px] leading-[45px] w-full p-2'>Create Your Account.</h1>
      <div className="form-group">
      <div className="input-wrapper">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input-text"
          value={formValues.username}
          onChange={handleChange}
          required
        />
        </div>
      </div>
      <div className="form-group">
      <div className="input-wrapper">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-text"
          value={formValues.email}
          onChange={handleChange}
          required
        />
        </div>
      </div>
      <div className="form-group">
      <div className="input-wrapper">
        <select name="role" value={formValues.role} onChange={handleChange} class="input-text" required>
          <option value="">Select a role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        </div>
      </div>
      <div className="form-group">
      <div className="input-wrapper">
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-text"
          value={formValues.password}
          onChange={handleChange}
          required
        />
        </div>
      </div>
      <div className="form-group">
      <div className="input-wrapper">
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeat Password"
          className="input-text"
          value={formValues.repeatPassword}
          onChange={handleChange}
          required
        />
      </div>
      </div>
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      <div className={`${styles.flexCenter} p-4`}>
      <button type="submit" className={` py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full ${styles}`}>Create Account</button>
      </div>
      <div>
      <p className={styles.paragraph} >Already have an account? <a className={`${styles.paragraph} text-black`} href='/login'>Login Here</a></p>
      </div>
    </form>
    <div className={layout.sectionImg}>  
    <img className='w-[80%] h-auto relative z-[2] p-2 md:px-20 sm:px-26 ss:px-34' src={ libraWhite } alt="aura" />
    </div>
    </div>
  );
};

export default IndexSignup;
