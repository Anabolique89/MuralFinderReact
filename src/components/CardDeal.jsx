import { card, city } from '../assets';
import styles, { layout } from '../style';
import Button from './Button';
import Button3 from './Button3';

const CardDeal = () => (

 <section className={layout.section}>
  <div className={layout.sectionInfo}>
    <h2 className={styles.heading2}>
      Are Legal Walls <br className='sm:block hidden' /> Hard to Find?
    </h2>
<p className={`${styles.paragraph} max-w-[470px] mt-5`}>
It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
</p>
<Button3 styles="mt-10"/>
  </div>
<div className={layout.sectionImg}>
<img src={city} alt="card" className='w-[100%] h-[100%] z-[9]' />
<div className='absolute z-[3] -left-10 top-4 w-[97%] h-[67%] rounded-full white__gradient opacity-[0.5]'/>
<div className='absolute z-[0] -left-10 bottom-2 w-[80%] h-[50%] rounded-full pink__gradient opacity-[0.5]'/>
</div>
 </section>
  
)

export default CardDeal