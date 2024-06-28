import styles from '../style';
import {bulbWhite} from '../assets';
import GetStarted from './GetStarted';

const WallsIntro = () => (
 
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
    
    <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6 `}>
    
<div className="flex flex-row justify-between items-center w-full">
  <h1 className="flex-1 font-raleway font-bold ss:text-[72px] text-[52px] text-white ss:leading-[100px] leading-[75px]">Looking for<br className="sm:block hidden" /> {" "}
   
    Legal Walls?</h1>
    <div className='ss:flex hidden md:mr-4 mr-0'>
<GetStarted/>
    </div>
</div>

<p className={`${styles.paragraph} max-w-[470px] mt-5`}>Looking for a legal wall to paint somewhere new? Bored of painting on canvas and wanna explore a new medium? We have the right 
stuff you need! Check out our map or access a list of all of our walls.</p>
    </div>
    <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
  <img src={bulbWhite} alt="interlinked" className="w-[100%] h-auto relative z-[5] p-8 md:px-20 sm:px-26 ss:px-34"/>
  <div className="absolute z-[0] w-[40%] h-[35%] bottom-0 rounded-full pink__gradient"/>
  <div className="absolute z-[1] w-[80%] h-[80%]  rounded-full bottom-8 white__gradient"/>
  <div className="absolute z-[0] w-[50%] h-[50%]  bottom-6 blue__gradient"/>
</div>

<div className={`ss:hidden ${styles.flexCenter}`}>
<GetStarted/>
</div>
   </section>

)

export default WallsIntro