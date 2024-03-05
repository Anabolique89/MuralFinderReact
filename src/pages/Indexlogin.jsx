import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles, { layout } from '../style';
import { swimWhite, fadeintoyouWhite } from '../assets';

const Indexlogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();
  console.log(email,password)
  navigate('/');
}

  return (
  
    <div className={`${layout.sectionImg} bg-indigo-700 mt-0`} >

   <form className="login-form absolute z-[5] backdrop-filter backdrop-blur-lg p-4 md:p-8 sm:p-10 ss:p-34 rounded-2xl border-solid border-2 border-indigo-600  " onSubmit={handleSubmit}>
   <h1 className='font-raleway font-semibold ss:text-[30px] text-[35px] text-white ss:leading-[40px] leading-[45px] w-full p-2'>Enter Your Account.</h1>
      <div className="form-group">

        <div class="input-wrapper">
        <input
          type="text"
          id="email"
          placeholder='Email'
          class="input-text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>
      </div>
      <div className="form-group">
        <div class="input-wrapper">
        <input
          type="password"
          id="password" 
          placeholder='Password'
          class="input-text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
      </div>
      <div className={`${styles.flexCenter} p-4`}>
      <button type="submit" className={` py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full ${styles}`}>Login</button>
    </div>
    <p className={`${styles.paragraph} text-indigo-600`}>Don't have an account? <a className={`${styles.paragraph} text-black`} href='/IndexSignup'>Register Here</a></p>
    </form>
    <div className={layout.sectionImg}>  
    <img className='w-[80%] h-auto relative z-[2] w-[100%] p-2 md:px-20 sm:px-26 ss:px-34' src={ fadeintoyouWhite } alt="swim" /></div>
    </div>
 
  )
}

export default Indexlogin