import styles from '../style';
import Button from './Button';

const CTA = () => (
   <section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col cta-block rounded-[20px] box-shadow `}>

    <div className='flex-1 flex flex-col'>
      <h2 className={styles.heading2}>Tell people about our app!</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>Invite your friends over to signup and join the fun and contribute to our worldwide artistic community!</p>
    </div>
    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
    <button type="button" className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-full ${styles}`}>SEND INVITE</button>
    </div>
    <div className='mb-10 pb-5'></div>
   </section>
  )


export default CTA