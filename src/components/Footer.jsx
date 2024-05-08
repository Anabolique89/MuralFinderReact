import styles from '../style';
import { ArtZoroLogoWhite } from "../assets";
import { footerLinks} from '../constants';
import { Link, useNavigate } from 'react-router-dom';


const Footer = () => (
  
    <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
      <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full `}>

<div className='flex-1 flex flex-col justify-start mr-10'>
  <img src={ ArtZoroLogoWhite } alt="ArtZoro" className='w-[80px] h-[72px] object-contain'/>
  <p className={`${styles.paragraph} mt-4 max-w-[310px]`}>Explore new terrain and expand your creativity with ease.</p>
</div>
<div className='flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10'>
{footerLinks.map((footerLink) =>(
  <div key={footerLink.key} className='flex flex-col ss:my-0 my-4 min-w-[150px]'>
    <h4 className='font-raleway font-bold text-[18px] leading-[27px] text-white'>
      {footerLink.title}
    </h4>
    <ul>
      {footerLink.links.map((Link, index) => (
        <li key={Link.name} className={`font-raleway font-normal text-[16px] leading-[24px] 
        text-dimWhite hover:text-secondary cursor-pointer`}>
            <a href={Link.link} className="block">
        {Link.name}
        </a>
        </li>
      ))}
    </ul>
    </div>
))}
</div>

      </div>
      <div className='flex flex-column flex-start'>
      <p className="font-raleway font-normal text-dimWhite text-[14px] leading-[24.8px] mt-4"><span className="font-raleway font-bold text-purple-950 hover:text-orange-600 text-[18px] leading-[32.8px]">Disclaimer! <br /></span>All graffiti & streetart spots in this legal wall directory are contributed by users. 
  Information you find here may be incorrect or outdated. 
  Always verify the legality of graffiti walls with local authorities before painting. 
  We do not take responsibility in any illegal activities performed based on the information on this site. 
  Also refer to our Terms & Conditions & Privacy Policy</p></div>
    </section>
  )

export default Footer