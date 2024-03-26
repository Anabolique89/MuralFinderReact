import React,{useState, useEffect} from 'react';
import {Link, useNavigate } from 'react-router-dom';
import styles, { layout } from '../style';
import { fadeintoyouWhite } from '../assets';
import { toast } from "react-toastify";

const Indexlogin = () => {

  const [email, emailupdate] = useState('');
  const [password, passwordupdate] = useState('');

  const usenavigate=useNavigate();

  useEffect(()=>{
sessionStorage.clear();
  },[]);

  // const ProceedLogin = (e) => {
  //     e.preventDefault();
  //     if (validate()) {
  //         ///implentation
  //         // console.log('proceed');
  //         fetch("https://api.muralfinder.net/api/login" + username).then((res) => {
  //             return res.json();
  //         }).then((resp) => {
  //             //console.log(resp)
  //             if (Object.keys(resp).length === 0) {
  //                 toast.error('Please Enter valid username');
  //             } else {
  //                 if (resp.password === password) {
  //                     toast.success('Success');
  //                     sessionStorage.setItem('username',username);
  //                     sessionStorage.setItem('userrole',resp.role);
  //                     usenavigate('/')
  //                 }else{
  //                     toast.error('Please Enter valid credentials');
  //                 }
  //             }
  //         }).catch((err) => {
  //             toast.error('Login Failed due to :' + err.message);
  //         });
  //     }
  // }

  const ProceedLoginusingAPI = (e) => {
      e.preventDefault();
      if (validate()) {
          ///implentation
          // console.log('proceed');
          let inputobj={"email": email,
          "password": password};
          fetch("https://api.muralfinder.net/api/login", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(inputobj)
          }).then(async (response) => {
            const data = await response.json(); // Parse the JSON response
            console.log(data.data);
            const dataObj = data.data;
            // Now you have the response data in a JavaScript object
            // save token to local storage 
            toast.success(data.message);
            sessionStorage.setItem('user',dataObj.user);
            sessionStorage.setItem('token',dataObj.token);
            // navigate('/login');
        }).catch((err) => {
          toast.error('Login Failed due to :' + err.message);
        });
    }
}
            
  
  const validate = () => {
      let result = true;
      if (email === '' || email === null) {
          result = false;
          toast.warning('Please Enter Username');
      }
      if (password === '' || password === null) {
          result = false;
          toast.warning('Please Enter Password');
      }
      return result;
  }

  return (
  
    <div className={`${layout.sectionImg} bg-indigo-700 mt-0`} >

   <form className="login-form absolute z-[5] backdrop-filter backdrop-blur-lg p-4 md:p-8 sm:p-10 ss:p-34 rounded-2xl border-solid border-2 border-indigo-600  " onSubmit={ProceedLoginusingAPI}>
   <h1 className='font-raleway font-semibold ss:text-[30px] text-[35px] text-white ss:leading-[40px] leading-[45px] w-full p-2'>Enter Your Account.</h1>
      <div className="form-group">

        <div class="input-wrapper">
        <input
            type="text"
            name="email"
            placeholder="Username or Email"
            className="input-text"
            value={email} 
            onChange={e => emailupdate(e.target.value)}
            required
        />
        </div>
      </div>
      <div className="form-group">
        <div class="input-wrapper">
        <input
     type="password"
     name="password"
     placeholder="Password"
     className="input-text"
     value={password} 
     onChange={e => passwordupdate(e.target.value)}
     required
        />
        </div>
      </div>
      <div className={`${styles.flexCenter} p-4`}>
      <button type="submit" className={` py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full ${styles}`}>Login</button>
      <Link className="btn btn-success" to={'/IndexSignup'}>New User</Link>
    </div>
    <p className={`${styles.paragraph} text-indigo-600`}>Don't have an account? <a className={`${styles.paragraph} text-black`} href='/IndexSignup'>Register Here</a></p>
    </form>
    <div className={layout.sectionImg}>  
    <img className='w-[80%] h-auto relative z-[2] w-[100%] p-2 md:px-20 sm:px-26 ss:px-34' src={ fadeintoyouWhite } alt="swim" /></div>
    </div>
 
  )
}

export default Indexlogin