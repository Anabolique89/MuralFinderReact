import React from 'react';
import styles from '../style';
import { catWhite } from '../assets';
import Button2 from './Button2';

const HeroCommunity = () => (

    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
    
    <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6 `}>
      
<div className="flex flex-row justify-between items-center w-full">
  <h1 className="flex-1 font-raleway font-bold ss:text-[72px] text-[52px] text-white ss:leading-[100px] leading-[75px]">Are you<br className="sm:block hidden" /> {" "}
    {/* <span className="text-gradient font-blowBrush">ArtZoro App</span> <br/> {" "} */}
     an artist?</h1>
    <div className='ss:flex hidden md:mr-4 mr-0'>
    </div>
</div>

<p className={`${styles.paragraph} max-w-[470px] mt-5`}>On our community page you get the chance to open up for commissions and showcase your work to the public. Customise your profile so the people looking for artists can see what your style looks like!</p>
<button type="button" className={`mt-4 py-2 px-4 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-full ${styles}`}>Browse Jobs</button>
    </div>
    <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
  <img src={catWhite} alt="cat" className="w-[70%] h-auto relative z-[5] p-0 md:px-8 sm:px-12 ss:px-20"/>
  <div className="absolute z-[0] w-[40%] h-[35%] bottom-0 rounded-full pink__gradient"/>
  <div className="absolute z-[1] w-[80%] h-[80%]  rounded-full bottom-8 white__gradient opacity-[0.5]"/>
  <div className="absolute z-[0] w-[50%] h-[50%]  bottom-6 blue__gradient"/>
 
</div>


   </section>

 
  )


export default HeroCommunity