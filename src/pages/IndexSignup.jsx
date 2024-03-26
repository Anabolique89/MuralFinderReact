import React, { useState } from 'react';
import styles, { layout } from '../style';
import { libraWhite } from '../assets';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const IndexSignup = () => {

const [username, usernamechange] = useState("");
const [email, emailchange] = useState("");
const [role, rolechange] = useState("");
const [password, passwordchange] = useState("");
const [password_confirmation, repeatPasswordchange] = useState("");

const navigate = useNavigate();

const IsValidate = () => {
    let isproceed = true;
    let errormessage = 'Please enter the value in ';
  
    if (password === null || password === '') {
        isproceed = false;
        errormessage += ' Password';
    }
    if (email === null || email === '') {
        isproceed = false;
        errormessage += ' Email';
    }

    if(!isproceed){
        toast.warning(errormessage)
    }else{
        if(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)){

        }else{
            isproceed = false;
            toast.warning('Please enter the valid email')
        }
    }
    return isproceed;
}


const handleSubmit = (e) => {
        e.preventDefault();
        let regobj = { username, email, role, password, password_confirmation };
        if (IsValidate()) {
  
        fetch("https://api.muralfinder.net/api/register", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(regobj)
          }).then(async (response) => {
            const data = await response.json(); // Parse the JSON response
            console.log(data); // Now you have the response data in a JavaScript object
            toast.success(data.message);
            navigate('/login');
        }).catch((err) => {
            toast.error('Failed :' + err.message);
        });
    }
}

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
          value={username} 
          onChange={e => usernamechange(e.target.value)}
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
          value={email} 
          onChange={e => emailchange(e.target.value)}
          required
        />
        </div>
      </div>
      <div className="form-group">
      <div className="input-wrapper">
        <select name="role"  value={role} 
          onChange={e => rolechange(e.target.value)} class="input-text" required>
          <option value="">Select a role</option>
          <option value="artist">Artist</option>
          <option value="art_lover">Art Lover</option>
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
          value={password} 
          onChange={e => passwordchange(e.target.value)}
          required
        />
        </div>
      </div>
      <div className="form-group">
      <div className="input-wrapper">
        <input
          type="password"
          name="password_confirmation"
          placeholder="Repeat Password"
          className="input-text"
          value={password_confirmation} 
          onChange={e => repeatPasswordchange(e.target.value)}
          required
        />
      </div>
      </div>
      {/* {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>} */}
      <div className={`${styles.flexCenter} p-4`}>
      <button type="submit" className={` py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full ${styles}`}>Create Account</button>
      <Link to={'/Login'} className="btn btn-danger">Close</Link>
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
