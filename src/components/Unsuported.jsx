import { DigitalTrauma } from '../assets';
import styles, { layout } from '../style';
import { Link } from 'react-router-dom';

const UnsupportedAuth = () => (
  <section id="auth-error" className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <img src={DigitalTrauma} alt="unsupported-auth" className='w-[70%] h-auto relative z-[5]' />
      <div className='absolute z-[3] -left-10 top-4 w-[97%] h-[67%] rounded-full white__gradient opacity-[0.5]' />
      <div className='absolute z-[0] -left-10 bottom-2 w-[80%] h-[50%] rounded-full pink__gradient opacity-[0.5]' />
    </div>
    
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>Authentication Method Not Supported</h2>
      <p className={`${styles.paragraph} max-w-[470px]`}>
        The authentication method you are trying to use is currently not supported on our platform.
        <br /><br />
        Please try signing in with Google instead to access your account. We apologize for any inconvenience.
      </p>

      <div className={`${styles.flexCenter} mt-6`}>
        <Link to={'/signin-google'} className={`flex py-2 px-4 mr-4 xs:py-1 xs:px-2 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full ${styles}`}>
          Sign In with Google
        </Link>
        <Link to={'/help'} className={`flex py-2 px-4 xs:py-1 xs:px-2 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full ${styles}`}>
          Need Help?
        </Link>
      </div>
    </div>
  </section>
);

export default UnsupportedAuth;
