import { about } from '../constants';
import styles, { layout } from '../style';
import Button from './Button';
import { Link} from 'react-router-dom';

const FeatureCard = ({icon, title, content, index}) =>(
  <div className={`flex flex-row p-6 rounded-[20px] ${index !== about.length - 1 ? "mb-6" : "mb-0"} cta-block`}>
    <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue `}>
      <img src={icon} alt="icon" className='w-[50%] h-[50%] object-contain' />
    </div>
    <div className='flex-1 flex flex-col ml-3'>
<h4 className='font-raleway font-semibold text-white text-[18px] leading-[23px] mb-1'>
  {title}
</h4>
<p className='font-roboto font-normal text-dimWhite text-[16px] leading-[24px] mb-1'>
  {content}
</p>
    </div>
  </div>
)

const Business = () => {
  return (
    <section id="about" className={layout.section}>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>Add new walls <br className='sm:block hidden' />on the map.</h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>If you have any legal walls 
          in mind don't hesitate to add them to our map. 
          By doing this you are sharing with and helping 
          thousands of artists that are looking for places 
          to paint or explore.</p>
          <Link to={'/addWall'} href="" ><Button styles="mt-10" /></Link>
      </div>
<div className={`${layout.sectionImg} flex-col`}>
{about.map((about,index) =>(
  <FeatureCard key={about.id} {...about} index={index}/>
))}
</div>

    </section>
  )
}

export default Business